import test from "@playwright/test";
import { Home } from "./pages/Home";
import { faker } from "@faker-js/faker";

let home: Home;



test.beforeEach(async ({ page }) => {
    home = new Home(page);
    await home.gotoToHomePage('https://demo.playwright.dev/todomvc/#/', page);
});

test('Create a todo item successfully', async ({ page }) => {
    const name = faker.food.fruit();
    await home.createTodo(name);
    await home.verifyItemTodoCreated(name, 1);
});

test('Create multiple todo items successfully', async ({ page }) => {
    const name = faker.food.fruit();
    await home.createMultipleTodoItems(() => name, 3);
    await home.verifyItemsTodoCreated(3);
});


test('Do not allow the creation of empty tasks or tasks with only spaces.', async ({ page }) => {
    await home.createTodo('');
    await home.verfifyClearCompleted()
});


test('Complete and uncomplete a todo item successfully', async ({ page }) => {
    const name = faker.food.fruit();
    await home.createTodo(name);
    await home.markAIndividualItemAsCompleted();
    await home.verifyAddItemsTodo(0);
    await home.markAIndividualItemAsCompleted();
    await home.verifyAddItemTodo(1);
});


test('Filtrar tareas por estado (All / Active / Completed)', async ({ page }) => {
    const name = faker.food.fruit();
    await home.createMultipleTodoItems(() => name, 2);
    await page.pause();
    await home.markAItemOfItemListAsCompleted(1);
    await home.selectedFilterActive();
    await home.verifyItemsFilter(1);
    await home.selectedFilterCompleted();
    await home.verifyItemsFilter(1);
    await home.selectedFilterAll();
    await home.verifyItemsFilter(2);
});


test('Delete a todo item successfully', async ({ page }) => {
    const name = faker.food.fruit();
    await home.createMultipleTodoItems(() => name, 2);
    await home.deleteAItemTodoList();
    await home.verifyItemsFilter(1);
    await home.verifyAddItemTodo(1);
});


