import { GoogleGenAI } from '@google/genai';
import { aiResponseCache } from '../cache';

export interface TripPlanRequest {
  destination: string;
  durationDays: number;
  travelGroup: string; // solo, couple, family, friends, corporate
  preferences?: string[];
  budgetTier?: 'budget' | 'comfortable' | 'luxury';
}

export interface TravelAdviceResponse {
  answer: string;
  recommendedPlaces: string[];
  recommendedVehicle: string;
  estimatedBudgetInr: number;
  proTips: string[];
  cached: boolean;
}

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

export class AiTravelService {
  /**
   * Generates intelligent travel plans and cab itinerary recommendations
   */
  public static async generateTripPlan(req: TripPlanRequest): Promise<TravelAdviceResponse> {
    const cacheKey = `trip_${req.destination}_${req.durationDays}_${req.travelGroup}_${req.budgetTier || 'comfortable'}`;
    const cached = aiResponseCache.get(cacheKey);
    if (cached) {
      return { ...cached, cached: true };
    }

    const ai = getAiClient();

    // High quality deterministic fallback if no API key or during network downtime
    if (!ai) {
      const fallback = this.generateFallbackPlan(req);
      aiResponseCache.set(cacheKey, fallback);
      return fallback;
    }

    try {
      const prompt = `
You are the Chief Travel & Fleet Specialist for Waltair Travels in Visakhapatnam, Andhra Pradesh.
Generate a concise, highly practical, expert road trip itinerary and cab recommendation for:
Destination: ${req.destination}
Duration: ${req.durationDays} day(s)
Group Type: ${req.travelGroup}
Preferences: ${req.preferences?.join(', ') || 'Scenic views, comfortable ride, local food, key landmarks'}
Budget Tier: ${req.budgetTier || 'comfortable'}

Format your response strictly as JSON with this exact schema:
{
  "answer": "A friendly 2-3 paragraph breakdown of the ideal day-by-day travel plan with pickup times and sightseeing sequence.",
  "recommendedPlaces": ["Place 1", "Place 2", "Place 3", "Place 4", "Place 5"],
  "recommendedVehicle": "Sedan (Swift Dzire) / SUV (Innova Crysta) / Prime SUV / Tempo Traveller with brief reason why",
  "estimatedBudgetInr": 4500,
  "proTips": ["Tip 1 about ghat roads or early morning departures", "Tip 2 about food/stops", "Tip 3 about airport/station timings"]
}
`;

      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI generation timed out')), 6000)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);

      const text = response.text || '{}';
      const parsed = JSON.parse(text);

      const result: TravelAdviceResponse = {
        answer: parsed.answer || 'Waltair Travels offers door-to-door customized chauffeur-driven cabs.',
        recommendedPlaces: Array.isArray(parsed.recommendedPlaces) ? parsed.recommendedPlaces : ['Araku Valley', 'Borra Caves', 'Katiki Waterfalls'],
        recommendedVehicle: parsed.recommendedVehicle || 'Toyota Innova Crysta (Best for Ghat Roads)',
        estimatedBudgetInr: typeof parsed.estimatedBudgetInr === 'number' ? parsed.estimatedBudgetInr : 3800,
        proTips: Array.isArray(parsed.proTips) ? parsed.proTips : ['Start early by 6:00 AM to enjoy foggy viewpoints.'],
        cached: false,
      };

      aiResponseCache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.warn('[AiTravelService] Gemini API call failed or timed out, returning fallback:', error);
      const fallback = this.generateFallbackPlan(req);
      aiResponseCache.set(cacheKey, fallback);
      return fallback;
    }
  }

  private static generateFallbackPlan(req: TripPlanRequest): TravelAdviceResponse {
    const isAraku = req.destination.toLowerCase().includes('araku');
    const isLambasingi = req.destination.toLowerCase().includes('lambasingi');
    const isAirport = req.destination.toLowerCase().includes('airport');

    if (isAraku) {
      return {
        answer: `For your ${req.durationDays}-day trip to Araku Valley, we recommend an early 06:00 AM departure from Vizag to catch the morning mist over the Eastern Ghats. You will traverse through Tyda Jungle Bells, explore the 150-million-year-old Borra Caves, sample fresh bamboo chicken, and visit the coffee plantations and Chaparai cascading waterfalls.`,
        recommendedPlaces: ['Borra Caves', 'Katiki Waterfalls', 'Coffee Plantations', 'Chaparai Waterfalls', 'Padmapuram Gardens', 'Tribal Museum'],
        recommendedVehicle: 'Toyota Innova Crysta (SUV) - Ideal high ground clearance and comfort for hairpin curves.',
        estimatedBudgetInr: req.durationDays === 1 ? 3800 : 7200,
        proTips: [
          'Pre-book Katiki Falls 4x4 local jeeps at Borra Caves junction.',
          'Start downhill return before 5:00 PM for the safest ghat descent.',
          'Taste authentic Araku organic coffee and Araku chocolates near Padmapuram.',
        ],
        cached: false,
      };
    }

    if (isLambasingi) {
      return {
        answer: `Lambasingi (the Kashmir of Andhra Pradesh) is ideal for cool morning fog, strawberry farms, and Thajangi reservoir viewpoints. Our chauffeurs are experienced with winter fog and night driving on Narsipatnam ghat roads.`,
        recommendedPlaces: ['Kothapalli Waterfalls', 'Thajangi Reservoir', 'Strawberry Plantations', 'Susan Garden (Yellow Flower Valley)', 'Ghat View Point'],
        recommendedVehicle: 'Toyota Innova Crysta / Maruti Ertiga with AC and fog lights.',
        estimatedBudgetInr: 4500,
        proTips: [
          'Best fog is visible between 05:30 AM and 07:30 AM.',
          'Carry warm fleece jackets as temperatures can drop below 8°C in winter.',
          'Try fresh local forest honey from Girijan Co-operative societies.',
        ],
        cached: false,
      };
    }

    if (isAirport) {
      return {
        answer: `Waltair Travels guarantees 100% on-time airport transfers for Visakhapatnam International Airport (VTZ) and the upcoming Bhogapuram Greenfield International Airport. Chauffeurs track real-time flight delays so you are never stranded.`,
        recommendedPlaces: ['VTZ Departure Gate', 'Bhogapuram Aerocity Corridor', 'Rushikonda IT SEZ', 'City Center'],
        recommendedVehicle: 'Swift Dzire Sedan or Toyota Innova for excessive airline luggage.',
        estimatedBudgetInr: 800,
        proTips: [
          'Provide your flight number during booking for automated landing tracking.',
          'Our airport flat rates include toll fees and zero surge guarantees.',
        ],
        cached: false,
      };
    }

    return {
      answer: `Enjoy a seamless journey to ${req.destination} with Waltair Travels. Our verified chauffeurs guarantee prompt door-to-door pickup, clean sanitized vehicles, and transparent pricing.`,
      recommendedPlaces: ['RK Beach', 'Kailasagiri Hilltop', 'Submarine Museum', 'Rushikonda Beach', 'Simhachalam Temple'],
      recommendedVehicle: 'Swift Dzire Sedan (Family of 4) or Innova (Family of 6-7)',
      estimatedBudgetInr: 2200,
      proTips: [
        'Local 8 Hours / 80 Km rental package is the most economical for comprehensive city tours.',
        'Zero advance cancellation fees prior to driver dispatch.',
      ],
      cached: false,
    };
  }
}
