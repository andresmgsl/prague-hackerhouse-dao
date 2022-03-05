import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { map, pipe } from 'rxjs';

///////// TEMP
const temporalProjects = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
];
function createFakeProject(ids: string[]): Project[] {
  return ids.map((id) => ({
    id: id,
    name: 'String',
    author: 'String',
    description: 'String',
    votes: 0,
  }));
}
///////// END

export interface Project {
  id: string;
  name: string;
  author: string;
  description: string;
  votes: number;
}

interface ViewModel {
  loading: boolean;
  projectsIds: string[] | null;
  projects: Project[];
}

const initialState: ViewModel = {
  loading: false,
  projectsIds: [],
  projects: [],
};

@Injectable()
export class ProjectsStore extends ComponentStore<ViewModel> {
  readonly projectsIds$ = this.select(({ projectsIds }) => projectsIds);
  readonly projects$ = this.select(({ projects }) => projects);

  constructor() {
    super(initialState);

    this._setProjectsId(temporalProjects);
    this._loadProjects(temporalProjects);
  }

  private readonly _loadProjects = this.effect<string[]>(
    pipe(
      map((projectsIds) => createFakeProject(projectsIds)),
      tapResponse(
        (projects) => this.patchState({ projects }),
        (error) => console.log('error', error)
      )
    )
  );

  private readonly _setProjectsId = this.updater<string[]>(
    (state, projectsId) => ({
      ...state,
      projectsId,
    })
  );
}
