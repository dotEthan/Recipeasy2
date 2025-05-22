import { vi } from "vitest";

export const mockCollectionComponent = () =>
  vi.mock("@/components/collections/CollectionComponent.vue", () => ({
    default: {
      name: "CollectionComponent",
      template: '<div class="collection-mock" data-testid="collection"></div>'
    }
  }));

export const mockUnsavedDataModal = () =>
  vi.mock("@/components/core/shared/unsavedDataModal/UnsavedDataModalComponent.vue", () => ({
    default: {
      name: "UnsavedDataModalComponent",
      template: '<div class="modal-mock" data-testid="unsaved-modal"></div>'
    }
  }));

export const mockRecipeDetails = () =>
  vi.mock("@/components/core/recipeList/recipeDetails/recipeDetailsComponent.vue", () => ({
    default: {
      name: "RecipeDetailsComponent",
      template: '<div class="recipe-details-mock" data-testid="recipe-details"></div>'
    }
  }));
