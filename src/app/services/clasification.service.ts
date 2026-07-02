import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { from } from 'rxjs';

import { environment } from 'src/environments/environment.prod';

import { ILeague } from '../models/league.model';
import { ISeason } from '../models/season.model';
import { IClasification } from '../models/clasification.model';
import { CODE_LEAGUES } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ClasificationService {

  constructor() { }

  getFootballLeagues() {
    return from(
      CapacitorHttp.get({
        url: `${environment.apiURL}/all_leagues.php`
      }).then((response: HttpResponse) => {

        const leagues = response.data['leagues'] as ILeague[];

        if (!leagues) {
          return [];
        }

        return leagues
          .filter(league => CODE_LEAGUES.includes(league.idLeague))
          .sort((a, b) =>
            a.strLeagueAlternate < b.strLeagueAlternate ? -1 : 1
          );

      }).catch(() => {
        return [];
      })
    );
  }

  getSeasons(idLeague: string) {
    return from(
      CapacitorHttp.get({
        url: `${environment.apiURL}/search_all_seasons.php?id=${idLeague}`
      }).then((response: HttpResponse) => {

        const seasons = response.data['seasons'] as ISeason[];

        if (!seasons) {
          return [];
        }

        return seasons.reverse();

      }).catch(() => {
        return [];
      })
    );
  }

  getTableClasification(idLeague: string, season: string) {
    return from(
      CapacitorHttp.get({
        url: `${environment.apiURL}/lookuptable.php?l=${idLeague}&s=${season}`
      }).then((response: HttpResponse) => {

        const clasification = response.data['table'] as IClasification[];

        if (!clasification) {
          return [];
        }

        return clasification;

      }).catch(() => {
        return [];
      })
    );
  }

  getTeamLastEvents(idTeam: string) {
    return from(
      CapacitorHttp.get({
        url: `${environment.apiURL}/eventslast.php?id=${idTeam}`
      }).then((response: HttpResponse) => {

        return response.data['results'] || [];

      }).catch(() => {
        return [];
      })
    );
  }

}