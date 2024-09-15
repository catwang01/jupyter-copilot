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
    this.node.classList.add('jp-mod-highlighted');
  }

  /**
   * Set the widget text content
   *
   * @param summary The text to display
   */
  set status(value: GithubCopilotStatus) {
    console.log(`Status changes from ${this._status} to ${value}`)
    this._status = value;
    const newIcon = document.createElement('span');
    let className: string = 'octicon--copilot-error-16';
    switch (value)
    {
        case OGithubCopilotStatus.SignedIn:
            className = 'logos--github-copilot';
            break;
        case OGithubCopilotStatus.NotSignedIn:
            className = 'octicon--copilot-error-16';
            break;
        case OGithubCopilotStatus.Error:
            className = 'octicon--copilot-warning-16';
        default:
            break;
    }
    newIcon.classList.add(className);
    newIcon.classList.add('github-copilot-status');

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

  get status(): GithubCopilotStatus
  {
    return this._status;
  }

  get valueChanged(): Signal<this, GithubCopilotStatus>
  {
    return this._valueChanged;
  }
}