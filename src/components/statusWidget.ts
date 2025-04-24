import { Signal } from '@lumino/signaling';
import { Widget } from "@lumino/widgets";

export const OGithubCopilotStatus = {
    SignedIn: 0,
    NotSignedIn: 1,
    Error: 2
} as const;

export type GithubCopilotStatus = typeof OGithubCopilotStatus[keyof typeof OGithubCopilotStatus];

export class GithubCopilotStatusWidget extends Widget
{
  private _statusIcon: HTMLElement | null = null;
  private _status: GithubCopilotStatus  = OGithubCopilotStatus.NotSignedIn;
  private _valueChanged: Signal<this, GithubCopilotStatus> = new Signal<this, GithubCopilotStatus>(this);


  constructor() {
    super();
    this.status = OGithubCopilotStatus.NotSignedIn;
    this.addClass('jp-mod-highlighted');
  }

  set status(value: GithubCopilotStatus) {
    console.log(`Status changes from ${this._status} to ${value}`)
    this._status = value;
    const newIcon = document.createElement('span');
    let className: string = 'octicon--copilot-error-16';
    let title: string = 'Github Copilot not signed in';
    switch (value)
    {
        case OGithubCopilotStatus.SignedIn:
            className = 'logos--github-copilot';
            title = 'Github Copilot signed in';
            break;
        case OGithubCopilotStatus.NotSignedIn:
            className = 'octicon--copilot-error-16';
            title = 'Github Copilot not signed in';
            break;
        case OGithubCopilotStatus.Error:
            className = 'octicon--copilot-warning-16';
            title = 'Github Copilot runnning into error';
            break;
        default:
            break;
    }
    newIcon.classList.add(className, 'github-copilot-status');
    newIcon.title = title;

    if (this.node.children.length == 1)
    {
        this.node.replaceChild(newIcon, this._statusIcon!);
    }
    else
    {
        this.node.appendChild(newIcon);
    }
    this._statusIcon = newIcon;

    // publish changes
    this._valueChanged.emit(value);
  }

  /**
   * Change to new status. If the status is the same as the current status, nothing happens
   *
   * @param value The status to set
   */
  public changeToNewStatus(value: GithubCopilotStatus): void
  {
    if (this.status != value) 
      this.status = value;
  }

  get status(): GithubCopilotStatus
  {
    return this._status;
  }

  get valueChanged(): Signal<this, GithubCopilotStatus>
  {
    return this._valueChanged;
  }
}