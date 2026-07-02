import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonItem, IonSelect, IonSelectOption,
  IonGrid, IonRow, IonCol,
  IonList, IonLabel, IonButton
} from '@ionic/angular/standalone';

import { ClasificationService } from '../../services/clasification.service';
import { ILeague } from '../../models/league.model';
import { ISeason } from '../../models/season.model';
import { IClasification } from '../../models/clasification.model';

@Component({
  selector: 'app-clasification-table',
  templateUrl: './clasification-table.page.html',
  styleUrls: ['./clasification-table.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonItem, IonSelect, IonSelectOption,
    IonGrid, IonRow, IonCol,
    IonList, IonLabel, IonButton,
    CommonModule, FormsModule
  ]
})
export class ClasificationTablePage implements OnInit {

  leagues: ILeague[] = [];
  seasons: ISeason[] = [];
  clasification: IClasification[] = [];

  selectedLeague = '';
  selectedSeason = '';

  teamEvents: any[] = [];
  selectedTeam: IClasification | null = null;

  constructor(private clasificationService: ClasificationService) { }

  ngOnInit() {
    this.loadLeagues();
  }

  loadLeagues() {
    this.clasificationService.getFootballLeagues().subscribe({
      next: (data) => {
        this.leagues = data;
      }
    });
  }

  onLeagueChange() {
    this.seasons = [];
    this.clasification = [];
    this.teamEvents = [];
    this.selectedSeason = '';
    this.selectedTeam = null;

    if (!this.selectedLeague) {
      return;
    }

    this.clasificationService.getSeasons(this.selectedLeague).subscribe({
      next: (data) => {
        this.seasons = data;
      }
    });
  }

  onSeasonChange() {
    this.clasification = [];
    this.teamEvents = [];
    this.selectedTeam = null;

    if (!this.selectedLeague || !this.selectedSeason) {
      return;
    }

    this.clasificationService
      .getTableClasification(this.selectedLeague, this.selectedSeason)
      .subscribe({
        next: (data) => {
          this.clasification = data;
        }
      });
  }

  selectTeam(team: IClasification) {
    this.selectedTeam = team;
    this.showTeamHistory(team);
  }

  backToList() {
    this.selectedTeam = null;
    this.teamEvents = [];
  }

  showTeamHistory(team: IClasification) {
    this.teamEvents = [];

    this.clasificationService.getTeamLastEvents(team.idTeam).subscribe({
      next: (data) => {
        this.teamEvents = data;
      }
    });
  }

}