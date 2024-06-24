import Notifier from '@pourianof/notifier';

interface Author {
    name?: string;
    lastName?: string;
    email?: string[];
    affiliations?: string[];
    address?: string[];
}

interface NewDataNotifier {
    onNewAuthor(handler: (newAuthor: Author) => any): void;
}

interface ExtractionFilters {
    onlyMainAuthors?: boolean;
    onlyAuthorsWithEmail?: boolean;
}

declare class AuthorsProgressStateNotifier implements NewDataNotifier {
    private progressUpdateHandler;
    private lasProvider?;
    protected notifier: Notifier<'newemail'>;
    constructor(progressUpdateHandler: (state: {
        newAuthorData: Author;
        totalAuthorRecieved: number;
    }) => any, lasProvider?: NewDataNotifier | undefined);
    onNewAuthor(handler: (newAuthor: Author) => any): void;
    private catchedDataCounter;
    setProvider(provider: NewDataNotifier): void;
    private onNewAuthorDataRecieved;
}

declare enum ExtractSpeed {
    HIGH = 1000,
    MEDIUM = 2000,
    OPTIMIZED = 3500,
    LOW = 5000
}
interface ExtractionOption {
    ouputPath: string | (() => string | Promise<string>);
    tempPath: string;
    browserPath?: string;
    chromePath?: string;
    browserUserDataPath: string;
    progressMonitor?: AuthorsProgressStateNotifier;
    saveOnEveryItem?: boolean;
    extractionConf?: {
        boundary?: number;
        extractSpeed?: ExtractSpeed;
    } & ExtractionFilters;
}
declare function extractURLS(urls: string[], options: ExtractionOption): Promise<void>;

export { AuthorsProgressStateNotifier, ExtractSpeed, type NewDataNotifier, extractURLS as default };
