import RecipeCard from "./RecipeCard";
import { useLocalRecipes } from "@/hooks/useLocalRecipes";
import { useEffect } from "react";
import { Recipe } from "@/lib/types";

const RecipeResults = () => {
  const { saveRecipes } = useLocalRecipes();

  // Mock data - em produção virá da API
  const mockRecipes = [
    {
      id: "1",
      title: "Salada de Quinoa com Frango Grelhado",
      description: "Uma refeição completa e balanceada, rica em proteínas e fibras",
      prepTime: "25 min",
      servings: 2,
      calories: 320,
      difficulty: "Fácil" as const,
      tags: ["Proteína", "Fibras", "Low Carb"],
      ingredients: ["Quinoa", "Frango", "Brócolis", "Azeite", "Limão"],
      instructions: ["Cozinhe a quinoa", "Grelhe o frango", "Refogue o brócolis"]
    },
    {
      id: "2", 
      title: "Bowl de Brócolis e Quinoa Proteico",
      description: "Combinação perfeita de vegetais e grãos para uma refeição nutritiva",
      prepTime: "20 min",
      servings: 1,
      calories: 280,
      difficulty: "Fácil" as const,
      tags: ["Vegetariano", "Rico em Fibras", "Antioxidantes"],
      ingredients: ["Brócolis", "Quinoa", "Azeite", "Alho", "Parmesão"],
      instructions: ["Cozinhe a quinoa", "Refogue o brócolis", "Monte o bowl"]
    },
    {
      id: "3",
      title: "Frango Teriyaki com Vegetais",
      description: "Versão saudável do clássico teriyaki com molho caseiro",
      prepTime: "35 min", 
      servings: 3,
      calories: 410,
      difficulty: "Médio" as const,
      tags: ["Asian Fusion", "Alto Proteína", "Baixo Açúcar"],
      ingredients: ["Frango", "Brócolis", "Molho shoyu", "Gengibre", "Alho"],
      instructions: ["Marine o frango", "Prepare o molho", "Refogue tudo junto"]
    }
  ];

  // Salvar receitas automaticamente quando geradas
  useEffect(() => {
    const recipesToSave: Recipe[] = mockRecipes.map(recipe => ({
      id: recipe.id,
      name: recipe.title,
      description: recipe.description,
      nutritionalInfo: [`${recipe.calories} calorias`, `${recipe.servings} porções`],
      instructions: recipe.instructions,
      ingredientsList: recipe.ingredients.map(ingredient => ({
        name: ingredient,
        quantity: 1,
        unit: "unidade"
      })),
      prepTime: recipe.prepTime, // Keep as string to match the interface
      servings: recipe.servings,
      calories: recipe.calories,
      difficulty: recipe.difficulty,
      tags: recipe.tags,
      createdAt: new Date().toISOString()
    }));

    // Salvar automaticamente as receitas geradas
    saveRecipes(recipesToSave);
  }, [saveRecipes]); // Remove mockRecipes dependency to avoid infinite loop

  return (
    <section id="receitas" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Receitas Geradas para Você
          </h3>
          <p className="text-muted-foreground text-lg">
            Nossa IA criou essas receitas baseadas nos seus ingredientes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecipeResults;