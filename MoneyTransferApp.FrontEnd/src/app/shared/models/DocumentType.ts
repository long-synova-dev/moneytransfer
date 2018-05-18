export enum DocumentType {
    None = 0,
    Policy = 1,
    Processor = 2,
    Task = 3,
    Todo = 4,
}

export enum TaskType
{
    Performer = 1,
    Reviewer = 2
}

export enum TaskStatus
{
    New = 1,
    Scheduled = 2,
    InProgress = 3,
    PendingReview = 4,
    Rejected = 5,
    Done = 6
}