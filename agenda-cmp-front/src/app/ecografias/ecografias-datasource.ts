import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface EcoItem {
  id: number;
  patname: string;
  patsurname: string;
  docname?: string;
  docsurname?: string;
  ecogname: string;
  ecogsurname: string;
  econame: string;
  price: string;
  cmp_price: string;
  eco_price: string;
  date: any;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: EcoItem[] = [

];

/**
 * Data source for the Users view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class EcoDataSource extends DataSource<EcoItem> {
  data: EcoItem[] = EXAMPLE_DATA;
  backupData: any;
  constructor(private paginator: MatPaginator, private sort: MatSort) {
    super();
  }

  filter(filterValue: string) {
    filterValue = filterValue.toLowerCase();
    return this.data.filter((val) => {
      if (
        val.ecogname.toLowerCase().includes(filterValue) ||
        val.ecogsurname.toLowerCase().includes(filterValue) ||
        val.patsurname.toLowerCase().includes(filterValue) ||
        val.patname.toLowerCase().includes(filterValue)
      ) { return val; }
    });
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<EcoItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    // Set the paginator's length
    this.paginator.length = this.data.length;

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() { }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: EcoItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: EcoItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'ecogname': return compare(a.ecogname, b.ecogname, isAsc);
        case 'ecogsurname': return compare(a.ecogsurname, b.ecogsurname, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
