import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { LocalStorageSubject } from '@heavy-duty/rxjs';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { ComponentStore } from '@ngrx/component-store';

interface ViewModel {
  workspaceIds: string[] | null;
  workspaceId: string | null;
  isHandset: boolean;
}

const initialState: ViewModel = {
  workspaceIds: null,
  workspaceId: null,
  isHandset: false,
};

@Injectable()
export class ConfigStore extends ComponentStore<ViewModel> {
  private readonly _workspaceId = new LocalStorageSubject<string>(
    'workspaceId'
  );
  private readonly _loadedWorkspaces = new LocalStorageSubject<string[]>(
    'loadedWorkspaces'
  );
  readonly isHandset$ = this.select(({ isHandset }) => isHandset);
  readonly workspaceId$ = this.select(({ workspaceId }) => workspaceId);
  readonly workspaceIds$ = this.select(({ workspaceIds }) => workspaceIds);

  constructor(
    private readonly _breakpointObserver: BreakpointObserver,
    private readonly _walletStore: WalletStore
  ) {
    super(initialState);

    this._loadHandset(this._breakpointObserver.observe(Breakpoints.Handset));
  }

  private readonly _loadHandset = this.updater<BreakpointState>(
    (state, result) => ({
      ...state,
      isHandset: result.matches,
    })
  );
}
