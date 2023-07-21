import { createElement } from '../../utils/utils';
import APIClient from '../apiclient/apiclient';

export default abstract class View {
  private viewType: string;

  private viewClient: APIClient;

  abstract table: Element;

  abstract page: number;

  abstract pageLimit: number;

  constructor(type: string) {
    this.viewType = type;
    this.viewClient = new APIClient();
  }

  public get type() { return this.viewType; }

  public get client() { return this.viewClient; }

  public get content() { return this.getViewContent(); }

  public getTable(): Element {
    const tableItemsTag = this.type === 'winners' ? 'table' : 'div';
    const table = createElement('div', [`table-${this.type}`]);
    const tableInfo = createElement('div', ['table-info']);
    const tableItems = createElement(tableItemsTag, ['table-items']);

    table.append(tableInfo, tableItems);

    return table;
  }

  public fillTable(page: number): void {
    const tableInfo = this.table.querySelector('.table-info');
    const tableItems = this.table.querySelector('.table-items');

    tableInfo.innerHTML = '';
    tableItems.innerHTML = '';

    this.fillTableContent(page, tableInfo, tableItems);
  }

  public updateTable(page: number): void {
    const tableInfo = this.table.querySelector('.table-info');
    const tableItems = this.table.querySelector('.table-items');

    this.updateTableContent(page, tableInfo, tableItems);
  }

  public addTableInfo(total: string, parent: Element): void {
    const totalAmount = createElement('div', ['total-amount']);
    totalAmount.innerHTML = `<strong>Total: </strong><span class="amount">${total}</span>`;

    const pager = this.getPager(+total);

    parent.append(totalAmount, pager);
  }

  public updateTableInfo(total: string, parent: Element): void {
    const amount = parent.querySelector('.amount');
    const pager = parent.querySelector('.pager');
    const prev = pager.querySelector('.prev');
    const current = pager.querySelector('.current');
    const next = pager.querySelector('.next');

    if (amount instanceof HTMLElement) amount.innerText = total;
    this.calculatePager(+total, prev, current, next);
  }

  public getPager(total: number): Element {
    const pager = createElement('div', ['pager']);
    const prev = createElement('div', ['prev', 'pager_item']);
    const current = createElement('div', ['current', 'pager_item']);
    const next = createElement('div', ['next', 'pager_item']);

    const clickCallback = (event: Event, type: 'prev' | 'next'): void => {
      event.preventDefault();
      this.clickOn(type);
    };

    this.calculatePager(total, prev, current, next);

    prev.addEventListener('click', (event) => clickCallback(event, 'prev'));
    next.addEventListener('click', (event) => clickCallback(event, 'next'));

    pager.append(prev, current, next);

    return pager;
  }

  public clickOn(type: 'prev' | 'next') {
    this.page = type === 'prev' ? this.page - 1 : this.page + 1;
    this.updateTable(this.page);
  }

  public calculatePager(total: number, prev: Element, current: Element, next: Element): void {
    const currentElement = current;
    const lastPage = Math.ceil(total / this.pageLimit);

    if (this.page > lastPage) {
      this.page = lastPage;
      this.updateTable(this.page);
    } else {
      const currentPage = this.page;

      if (currentElement instanceof HTMLElement) currentElement.innerText = `${currentPage}`;

      prev.classList.remove('inactive');
      next.classList.remove('inactive');

      if ((currentPage - 1) <= 0) prev.classList.add('inactive');
      if ((currentPage + 1) > lastPage) next.classList.add('inactive');
    }
  }

  abstract getViewContent(): Element;

  abstract fillTableContent(page: number, tableInfo: Element, tableItems: Element): void;

  abstract updateTableContent(page: number, tableInfo: Element, tableItems: Element): void;
}
