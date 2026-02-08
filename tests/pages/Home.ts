import { expect, Locator, Page } from "@playwright/test";

export class Home {
    public readonly inputNewTodo: Locator;
    public readonly toggleAll: Locator;
    public readonly todoList: Locator;
    public readonly todoItems: Locator;
    public readonly todoCount: Locator;
    public readonly clearCompletedButton: Locator;

    // Filters
    public readonly filterAll: Locator;
    public readonly filterActive: Locator;
    public readonly filterCompleted: Locator;

    constructor(private readonly page: Page) {
        this.inputNewTodo = page.getByPlaceholder('What needs to be done?');
        this.toggleAll = page.getByLabel('Mark all as complete');
        this.todoList = page.locator('ul.todo-list');
        this.todoItems = page.getByTestId('todo-item');
        this.todoCount = page.getByTestId('todo-count');

        this.filterAll = page.getByRole('link', { name: 'All' });
        this.filterActive = page.getByRole('link', { name: 'Active' });
        this.filterCompleted = page.getByRole('link', { name: 'Completed' });

        this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
    }

    // --- Actions ---

    async goto() {
        await this.page.goto('https://demo.playwright.dev/todomvc/#/');
    }

    async createTodo(text: string) {
        await this.inputNewTodo.fill(text);
        await this.inputNewTodo.press('Enter');
    }

    async createMultipleTodos(generateName: () => string, count: number) {
        for (let i = 0; i < count; i++) {
            await this.createTodo(generateName());
        }
    }

    async toggleAllCompleted() {
        await this.toggleAll.check();
    }

    async completeItem(index: number = 0) {
        await this.todoItems.nth(index).getByRole('checkbox').check();
    }

    async uncompleteItem(index: number = 0) {
        await this.todoItems.nth(index).getByRole('checkbox').uncheck();
    }

    async deleteItem(index: number = 0) {
        const item = this.todoItems.nth(index);
        await item.hover();
        await item.getByRole('button', { name: 'Delete' }).click();
    }

    async applyFilter(filter: 'All' | 'Active' | 'Completed') {
        const filterLocators = {
            'All': this.filterAll,
            'Active': this.filterActive,
            'Completed': this.filterCompleted
        };
        await filterLocators[filter].click();
    }

    async clearCompletedTodos() {
        await this.clearCompletedButton.click();
    }

    // --- Assertions ---

    async verifyItemsCount(expectedCount: number) {
        await expect(this.todoItems).toHaveCount(expectedCount);
    }

    async verifyTodoCountLabel(expectedText: string) {
        // expectedText like "3 items left" or "0 items left"
        await expect(this.todoCount).toHaveText(expectedText);
    }

    async verifyItemContent(index: number, expectedText: string) {
        await expect(this.todoItems.nth(index)).toHaveText(expectedText);
    }

    async verifyAllItemsAreActive() {
        const items = await this.todoItems.all();
        for (const item of items) {
            await expect(item).not.toHaveClass(/completed/);
        }
    }

    async verifyListIsEmpty() {
        await expect(this.todoList).not.toBeVisible();
    }
}