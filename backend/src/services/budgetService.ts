import { Itinerary, BudgetOptimizationSuggestion } from '../types';

export class BudgetService {
  /**
   * Analyze itinerary budget against user budget and produce optimization suggestions
   */
  public static analyzeBudget(
    itinerary: Itinerary,
    targetBudget: number,
    travelers: number = 1,
    budgetType: 'per_person' | 'total_group' = 'per_person'
  ): {
    totalEstimatedCost: number;
    costPerPerson: number;
    effectiveTargetBudget: number;
    isOverBudget: boolean;
    difference: number;
    budgetUtilizationPercentage: number;
    suggestions: BudgetOptimizationSuggestion[];
  } {
    const totalCost = itinerary.totalEstimatedBudget;
    const costPerPerson = Math.round(totalCost / Math.max(1, travelers));
    
    // Calculate effective comparison budget based on budgetType
    const effectiveTarget = budgetType === 'per_person' ? targetBudget * travelers : targetBudget;
    const difference = totalCost - effectiveTarget;
    const isOverBudget = difference > 0;
    const budgetUtilizationPercentage = Math.round((totalCost / effectiveTarget) * 100);

    const suggestions: BudgetOptimizationSuggestion[] = [];

    // 1. Scan activities for high cost items
    let suggestionIdCounter = 1;
    itinerary.days.forEach((day, dIdx) => {
      day.activities.forEach((act, aIdx) => {
        if (act.estimatedCost > (effectiveTarget * 0.1) / itinerary.days.length && act.estimatedCost > 500) {
          suggestions.push({
            id: `opt-${suggestionIdCounter++}`,
            category: 'Activities',
            title: `Replace expensive activity: ${act.name}`,
            description: `Switch ${act.name} (${itinerary.currency} ${act.estimatedCost}) to a scenic nature walk, public park, or free architectural viewpoint nearby.`,
            potentialSavings: Math.round(act.estimatedCost * 0.7),
            actionType: 'free_alternative',
            targetActivityIndex: { dayIndex: dIdx, activityIndex: aIdx },
            replacementActivity: {
              name: `Scenic Local Viewpoint & Walk near ${act.location}`,
              description: `Enjoy a self-guided exploration of scenic vistas and tranquil local paths with zero ticket fees.`,
              estimatedCost: 0,
              category: 'Nature',
            },
          });
        }
      });
    });

    // 2. Scan transportation
    if (itinerary.budgetBreakdown.transportation > effectiveTarget * 0.25) {
      const savings = Math.round(itinerary.budgetBreakdown.transportation * 0.4);
      suggestions.push({
        id: `opt-${suggestionIdCounter++}`,
        category: 'Transportation',
        title: 'Switch to Shared or Public Transit Passes',
        description: `Opt for local daily transit passes or shared shuttles instead of private point-to-point taxis.`,
        potentialSavings: savings,
        actionType: 'change_transport',
      });
    }

    // 3. Scan accommodation
    if (itinerary.budgetBreakdown.accommodation > effectiveTarget * 0.45) {
      const savings = Math.round(itinerary.budgetBreakdown.accommodation * 0.3);
      suggestions.push({
        id: `opt-${suggestionIdCounter++}`,
        category: 'Accommodation',
        title: 'Choose Boutique Guesthouse or Verified Homestay',
        description: `Upgrading to a top-rated boutique homestay or eco-lodge can save roughly 30% without sacrificing comfort.`,
        potentialSavings: savings,
        actionType: 'change_stay',
      });
    }

    // 4. Food optimization
    if (itinerary.budgetBreakdown.food > effectiveTarget * 0.3) {
      const savings = Math.round(itinerary.budgetBreakdown.food * 0.25);
      suggestions.push({
        id: `opt-${suggestionIdCounter++}`,
        category: 'Food',
        title: 'Blend Authentic Street Food & Local Dhabas',
        description: `Mix fine-dining dinners with renowned local eateries, authentic cafes, and street food hubs for authentic local flavors at half the cost.`,
        potentialSavings: savings,
        actionType: 'free_alternative',
      });
    }

    return {
      totalEstimatedCost: totalCost,
      costPerPerson,
      effectiveTargetBudget: effectiveTarget,
      isOverBudget,
      difference,
      budgetUtilizationPercentage,
      suggestions: suggestions.slice(0, 5), // top 5 most impactful suggestions
    };
  }

  /**
   * Apply an optimization suggestion to an itinerary
   */
  public static applyOptimization(
    itinerary: Itinerary,
    suggestion: BudgetOptimizationSuggestion
  ): Itinerary {
    const updated = JSON.parse(JSON.stringify(itinerary)) as Itinerary;

    if (suggestion.actionType === 'free_alternative' && suggestion.targetActivityIndex && suggestion.replacementActivity) {
      const { dayIndex, activityIndex } = suggestion.targetActivityIndex;
      if (updated.days[dayIndex] && updated.days[dayIndex].activities[activityIndex]) {
        const oldCost = updated.days[dayIndex].activities[activityIndex].estimatedCost;
        const newCost = suggestion.replacementActivity.estimatedCost || 0;
        const savings = Math.max(0, oldCost - newCost);

        Object.assign(updated.days[dayIndex].activities[activityIndex], suggestion.replacementActivity);
        updated.days[dayIndex].estimatedDailyBudget = Math.max(0, updated.days[dayIndex].estimatedDailyBudget - savings);
        updated.budgetBreakdown.activities = Math.max(0, updated.budgetBreakdown.activities - savings);
        updated.totalEstimatedBudget = Math.max(0, updated.totalEstimatedBudget - savings);
      }
    } else if (suggestion.actionType === 'change_transport') {
      const savings = suggestion.potentialSavings;
      updated.budgetBreakdown.transportation = Math.max(0, updated.budgetBreakdown.transportation - savings);
      updated.totalEstimatedBudget = Math.max(0, updated.totalEstimatedBudget - savings);
    } else if (suggestion.actionType === 'change_stay') {
      const savings = suggestion.potentialSavings;
      updated.budgetBreakdown.accommodation = Math.max(0, updated.budgetBreakdown.accommodation - savings);
      updated.totalEstimatedBudget = Math.max(0, updated.totalEstimatedBudget - savings);
    }

    return updated;
  }
}

