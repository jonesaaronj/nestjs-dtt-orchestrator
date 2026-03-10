export enum TrackerEvent {
  Started = 'started',
  Completed = 'completed',
  Stopped = 'stopped',
}

export type Stats = {
  uploaded: number;
  downloaded: number;
};
