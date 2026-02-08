import { test } from "@playwright/test";
import { Home } from "./pages/Home";
import { faker } from "@faker-js/faker";

test.describe('Todo Management', () => {
    let home: Home;

    test.beforeEach(async ({ page }) => {
        home = new Home(page);
        await home.goto();
    });

    test('should create a single todo item successfully', async () => {
        const todoName = faker.food.fruit();
        await home.createTodo(todoName);

        await home.verifyItemsCount(1);
        await home.verifyItemContent(0, todoName);
        await home.verifyTodoCountLabel('1 item left');
    });

    test('should create multiple todo items with random names', async () => {
        const count = 3;
        await home.createMultipleTodos(() => faker.food.fruit(), count);

        await home.verifyItemsCount(count);
        await home.verifyAllItemsAreActive();
        await home.verifyTodoCountLabel(`${count} items left`);
    });

    test('should not allow creating empty todo items', async () => {
        await home.createTodo('');
        await home.verifyListIsEmpty();
    });

    test('should complete and uncomplete a todo item', async () => {
        const todoName = faker.food.fruit();
        await home.createTodo(todoName);

        // Complete
        await home.completeItem(0);
        await home.verifyTodoCountLabel('0 items left');

        // Uncomplete (toggle back)
        await home.uncompleteItem(0);
        await home.verifyTodoCountLabel('1 item left');
    });

    test('should delete a todo item successfully', async () => {
        await home.createTodo(faker.food.fruit());
        await home.deleteItem(0);

        await home.verifyListIsEmpty();
    });

    test('should filter todo items by status', async () => {
        const todo1 = 'Active Item';
        const todo2 = 'Completed Item';

        await home.createTodo(todo1);
        await home.createTodo(todo2);
        await home.completeItem(1); // Complete the second one

        // Filter Active
        await home.applyFilter('Active');
        await home.verifyItemsCount(1);
        await home.verifyItemContent(0, todo1);

        // Filter Completed
        await home.applyFilter('Completed');
        await home.verifyItemsCount(1);
        await home.verifyItemContent(0, todo2);

        // Filter All
        await home.applyFilter('All');
        await home.verifyItemsCount(2);
    });
});