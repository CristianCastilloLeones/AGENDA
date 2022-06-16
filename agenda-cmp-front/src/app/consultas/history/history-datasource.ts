import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface EventItem {
  id: number;
  pname: string;
  psurname: string;
  dname: string;
  dsurname: string;
  specialty: string;
  day: string;
  historia?: string|number;
  status: number;
}

const EXAMPLE_DATA: EventItem[] = [

];

export class EventsDataSource extends DataSource<EventItem> {
  data: EventItem[] = EXAMPLE_DATA;
  backupData: any;
  constructor(private paginator: MatPaginator, private sort: MatSort) {
    super();
  }

  filter(filterValue: string) {
    filterValue = filterValue.toLowerCase();
    return this.data.filter((val) => {
      if (
        val.specialty.toLowerCase().includes(filterValue) ||
        val.day.toLowerCase().includes(filterValue) ||
        val.pname.toLowerCase().includes(filterValue) ||
        val.psurname.toLowerCase().includes(filterValue) ||
        val.dname.toLowerCase().includes(filterValue) ||
        val.dsurname.toLowerCase().includes(filterValue)
      ) { return val; }
    });
  }

  connect(): Observable<EventItem[]> {

    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    this.paginator.length = this.data.length;

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  disconnect() { }

  private getPagedData(data: EventItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  private getSortedData(data: EventItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'pname': return compare(a.pname, b.pname, isAsc);
        case 'psurname': return compare(a.psurname, b.psurname, isAsc);
        case 'dname': return compare(a.dname, b.dname, isAsc);
        case 'dsurname': return compare(a.dsurname, b.dsurname, isAsc);
        case 'specialty': return compare(a.specialty, b.specialty, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'status': return compare(+a.status, +b.status, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
