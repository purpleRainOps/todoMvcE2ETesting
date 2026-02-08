import { expect, Locator, Page } from "@playwright/test";

export class Home {

    public readonly inputNewTodo: Locator;

    public readonly labelToggleAll: Locator;
    public readonly listItems: Locator;
    public readonly individualItem: Locator;
    public readonly selectIndividualItem: Locator;
    public readonly deleteIndividualItem: Locator;
    public readonly editIndividualItem: Locator;
    public readonly todoCount: Locator;
    public readonly filterActiveElements: Locator;
    public readonly filterCompletedElements: Locator;
    public readonly filterAllElements: Locator;
    public readonly buttonClearCompleted: Locator;

    constructor(page: Page) {
        this.inputNewTodo = page.getByRole('textbox', { name: 'What needs to be done?' });
        this.labelToggleAll = page.locator('//label[@for="toggle-all"]');
        this.listItems = page.locator('//ul[@class="todo-list"]');
        this.individualItem = page.locator('//ul[@class="todo-list"]/li');
        this.selectIndividualItem = page.locator('//input[@aria-label="Toggle Todo"]');
        this.deleteIndividualItem = page.locator('//button[@class="destroy"]');
        this.editIndividualItem = page.locator('//li[@class="editing"]//input[@aria-label="Toggle Todo"]');
        this.todoCount = page.locator('//span[@class="todo-count"]');
        this.filterActiveElements = page.locator('//a[text()="Active"]');
        this.filterCompletedElements = page.locator('//a[text()="Completed"]');
        this.filterAllElements = page.locator('//a[text()="All"]');
        this.buttonClearCompleted = page.locator('//button[@class="clear-completed"]');
    }

    async gotoToHomePage(url: string, page: Page) {
        await page.goto(url);
    }


    async createTodo(text: string) {
        await this.inputNewTodo.fill(text);
        await this.inputNewTodo.press('Enter');
    }

    async clearCompleted() {
        await this.buttonClearCompleted.click();
    }

    async markAItemOfItemListAsCompleted(nthItemTodo: number) {
        await this.selectIndividualItem.nth(nthItemTodo).click();
    }

    async markAIndividualItemAsCompleted() {
        await this.selectIndividualItem.click();
    }


    async createMultipleTodoItems(getName: () => string, numberItems: number) {
        for (let i = 0; i < numberItems; i++) {
            await this.createTodo(getName());
        }
    }

    async deleteAItemTodoList() {
        const item = this.individualItem.first();
        await item.hover();
        await item.locator(this.deleteIndividualItem).click();
    }

    async selectedFilterActive() {
        await this.filterActiveElements.click();
    }

    async selectedFilterCompleted() {
        await this.filterCompletedElements.click();
    }

    async selectedFilterAll() {
        await this.filterAllElements.click();
    }

    async verifyItemsFilter(itemsFilter: number) {
        await expect(this.individualItem).toHaveCount(itemsFilter);
    }

    async verifyItemTodoCreated(name: string, numberItems: number) {
        await expect(this.individualItem).toBeVisible();
        await expect(this.individualItem).toHaveText(name);
        await expect(this.individualItem).not.toHaveClass('completed');
        await this.verifyAddItemTodo(numberItems)
    }

    async verifyItemsTodoCreated(numberItems: number) {
        const items = await this.individualItem.all();
        console.log(items);
        for (const item of items) {
            await expect(item).toBeVisible();
            await expect(item).not.toHaveClass('completed');
        }
        await this.verifyAddItemsTodo(numberItems);
    }

    async verifyAddItemsTodo(count: number) {
        await expect(this.todoCount).toHaveText(`${count} items left`);
    }

    async verifyAddItemTodo(count: number) {
        await expect(this.todoCount).toHaveText(`${count} item left`);
    }


    async verfifyClearCompleted() {
        await expect(this.listItems).not.toBeVisible();
        await expect(this.inputNewTodo).toBeVisible();
    }
}