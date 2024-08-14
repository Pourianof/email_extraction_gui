import Browser, { Tab } from 'chrowser_module';
import Notifier from '@pourianof/notifier';

interface TabAsResource extends Tab {
    isLocked(): boolean;
    use(): void;
    release(): void;
}

declare class Waiter {
    static start(): Waiter;
    private constructor();
    private completed;
    get isCompleted(): boolean;
    private waiterResolver;
    private waiterRejector;
    private waiterPromise;
    start(): void;
    complete(err?: any): void;
    private waiters;
    then(onFulFil: () => any, onReject: (err: any) => any): Promise<void>;
}

declare enum BrowserManagerState {
    NOT_OPENED = 0,
    OPEN = 1,
    IS_OPENING = 2,
    CLOSED = 3
}

interface ConstrainedBrowser {
    newPage(): Promise<Tab>;
    useTab(numberOfTabs: number, tabCallback: (tabs: Tab[]) => Waiter): Promise<void>;
}
declare abstract class BaseBrowser implements ConstrainedBrowser {
    protected winHandlerPath: string;
    protected browserUserDataDirPath?: string | undefined;
    protected readonly browserPath?: string | undefined;
    protected readonly navigationSpeed?: number | undefined;
    protected state: BrowserManagerState;
    protected browser: Browser;
    constructor(winHandlerPath: string, browserUserDataDirPath?: string | undefined, browserPath?: string | undefined, navigationSpeed?: number | undefined);
    private browserClosingWaiter;
    run(): Promise<void>;
    waitForClosing(): Promise<void>;
    abstract initiateBrowser(): Promise<void>;
    provideAPI(): ConstrainedBrowser;
    close(): Promise<void>;
    stop(): void;
    private openedTabs;
    newPage(): Promise<TabAsResource>;
    abstract provideTab(): Promise<Tab>;
    getRawBrowser(): Browser;
    isClosed(): boolean;
    getAllOpenPages(): Tab[];
    useTab(numberOfTabs: number, tabCallback: (tabs: Tab[]) => Waiter): Promise<void>;
}

interface Author {
    name?: string;
    lastName?: string;
    email?: string[];
    affiliations?: string[];
    address?: string[];
    isMain?: boolean;
}

declare class LinkedListHandler<T extends {}> {
    protected _first?: LinkedItem<T>;
    protected _last?: LinkedItem<T>;
    get first(): LinkedItem<T> | undefined;
    get last(): LinkedItem<T> | undefined;
    private _length;
    get length(): number;
    adopt(item: T): void;
    adopt(item: LinkedItem<T>): void;
    remove(item: LinkedItem<T>): void;
    clear(): void;
}
declare class LinkedItem<T extends {}> {
    readonly item: T;
    constructor(item: T);
    _next?: LinkedItem<T>;
    _previous?: LinkedItem<T>;
    _handler?: LinkedListHandler<T>;
    get next(): LinkedItem<T> | undefined;
    get previous(): LinkedItem<T> | undefined;
}

declare class ExtractorHolder {
    private extractorState;
    constructor(extractorState: ExtractorCenteralState);
    private extracters;
    private provideUtilAPI;
    getExtractor(url: string): ArticleExtractor;
    getAllExtractors(): ArticleExtractor[];
}

interface ExtractorState {
    isStopped: boolean;
    filters: ExtractionFilters;
    browser: ConstrainedBrowser;
    tempPath: string;
}
interface ExtractorCenteralState extends ExtractorState {
    excelAPI: ExcelManager;
    holder: ExtractorHolder;
}

interface ExtractionFilters {
    onlyMainAuthors?: boolean;
    onlyAuthorsWithEmail?: boolean;
}
declare abstract class BaseExtracter<T extends {} = {}> {
    private extractorState;
    private excelApi;
    protected extractorOptions?: T | undefined;
    protected urlsToExtract: LinkedListHandler<string>;
    constructor(extractorState: ExtractorState, excelApi: ExcelExtracterAPI, extractorOptions?: T | undefined, urls?: string[]);
    protected get extractionFilters(): ExtractionFilters;
    protected get browser(): ConstrainedBrowser;
    protected get utilsAPI(): ExcelExtracterAPI;
    private state;
    private waiter?;
    extract(): Promise<void>;
    protected get isCanceled(): boolean;
    protected checkState(): Promise<void>;
    protected cancelBoundedProcess(cb: () => any): Promise<void>;
    cancel(): void;
    waitForExtraction(): Promise<void> | undefined;
    protected abstract extractSingleURL(url: string): Promise<void>;
    addURL(url: string[]): void;
    addURL(url: string): void;
    abstract urlValidation(url: string): void;
    private _add;
    private addAll;
}
declare abstract class ArticleExtractor extends BaseExtracter {
    protected processArticle(url: string, tab: Tab): Promise<void>;
    urlValidation(u: string): void;
    protected abstract validateURL(url: URL): void;
    abstract extractArticlePage(url: string, tab: Tab): Promise<Author[]>;
}

type ExcelPath = string | (() => string | Promise<string>);
interface NewDataNotifier {
    onNewAuthor(handler: (newAuthor: Author) => any): void;
}
declare class ExcelManager implements NewDataNotifier {
    constructor(filterOption: ExtractionFilters, actualPath: ExcelPath, tempPath: string, maxNumberOfRegistering?: number);
    onNewAuthor(handler: (newAuthor: Author) => any): void;
    private excelApiHandler;
    init(filterOption: ExtractionFilters, actualPath: ExcelPath, tempPath: string, maxNumberOfRegistering?: number): void;
    getTotalNumberOfExtractedAuthors(): number;
    provideSheet(sheetName: string, saveAfter?: number): AuthorToExcel;
    close(): Promise<void>;
    save(saveToMainPath?: boolean): Promise<void>;
}
interface ExcelOperation {
    end(): Promise<void>;
    save(writeMain: boolean): Promise<void>;
}
declare class ExcelSheetCenterHandler implements NewDataNotifier, ExcelOperation {
    private filters;
    private actualPath;
    private maxDataRegister?;
    protected notifier: Notifier<'newemail'>;
    private workBook;
    private tempPath;
    constructor(filters: ExtractionFilters, actualPath: ExcelPath, tempPath: string, maxDataRegister?: number | undefined);
    onNewAuthor(handler: (info: Author) => any): void;
    private write;
    private evaluatedActualPath?;
    private lastAuthorsNumberWrite;
    end(): Promise<void>;
    save(writeMain?: boolean): Promise<void>;
    saveToTemp(): Promise<void>;
    private registeredCounter;
    addAuthorToSheet(authorData: Author, sheetName: string): void;
    getTotalNumberOfExtractedAuthors(): number;
    private get hasBound();
    private isClosed;
    close(): Promise<void>;
}
declare class AuthorToExcel {
    private readonly handler;
    private sheetName;
    protected saveAfter: number;
    constructor(handler: ExcelSheetCenterHandler, sheetName: string, saveAfter?: number);
    addAuthor(authorData: Author[]): Promise<void>;
    addAuthor(authorData: Author): Promise<void>;
    save(saveToMain?: boolean): Promise<void>;
    close(): Promise<void>;
}
interface ExcelExtracterAPI {
    addAuthor(authroData: Author[]): Promise<void>;
    addAuthor(authroData: Author): Promise<void>;
    addAuthor(authroData: any): Promise<void>;
    save(saveToMain?: boolean): Promise<void>;
    close(): Promise<void>;
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
    browserUserDataPath?: string;
    progressMonitor?: AuthorsProgressStateNotifier;
    saveOnEveryItem?: boolean;
    winHandlerPath: string;
    extractionConf?: {
        boundary?: number;
        extractSpeed?: ExtractSpeed;
    } & ExtractionFilters;
    isGoogleScholar?: boolean;
    gsOptions?: {
        maxPage?: number;
    };
}
declare class Extractor implements ExtractorCenteralState {
    private urls;
    private options;
    private _browser;
    private _excelAPI;
    private _tempPath;
    private _filters;
    private _holder;
    get browser(): BaseBrowser;
    get excelAPI(): ExcelManager;
    get tempPath(): string;
    get filters(): ExtractionFilters;
    get holder(): ExtractorHolder;
    private state;
    constructor(urls: string[], options: ExtractionOption);
    start(): Promise<{
        elapsedTime: number;
        numberOfExtractedAuthors: number;
    }>;
    private extractorHandler;
    private _extract;
    get isStopped(): boolean;
    stop(): void;
}

export { AuthorsProgressStateNotifier, ExtractSpeed, type NewDataNotifier, Extractor as default };
