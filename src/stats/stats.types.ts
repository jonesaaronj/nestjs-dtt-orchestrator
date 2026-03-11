export enum TrackerEvent {
  Started = 'started',
  Completed = 'completed',
  Stopped = 'stopped',
}

export type DownloadStats = {
  uploaded: number;
  downloaded: number;
};
