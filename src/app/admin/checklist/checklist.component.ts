import {Component, OnInit, ViewChild} from '@angular/core';
import { Checklist } from 'src/app/_models/checklist';
import { ArtistsService } from 'src/app/admin/artists/service/artists.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ChecklistComponent implements OnInit {
  displayedColumns = ['id', 'artist', 'day', 'invites', 'recording', 'sacem'];
  checklists: Checklist[];
  expandedElement: Checklist;
  dataSource: MatTableDataSource<Checklist>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private artistsService: ArtistsService) { }

  ngOnInit() {
    this.artistsService.getChecklists()
      .subscribe(checklists => {
        this.checklists = checklists;
        this.dataSource = new MatTableDataSource(this.checklists);
        this.dataSource.sort = this.sort;
      });

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
