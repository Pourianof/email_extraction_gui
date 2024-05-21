import { Page } from 'puppeteer';
import BaseExtracter from './baseExtracter';
import { ConstrainedBrowser } from '../helpers/browserManager';
import ExtracterUtilsAPI from '../helpers/ExtracterUtils';

export default class ElsevierExtracter extends BaseExtracter {
  static ELSEVIER_BASE_URL = 'https://www.sciencedirect.com';
  async extractSingleURL(url: string): Promise<void> {
    return new ElsevierJournalExtracter(
      this.browser,
      url,
      this.utilsAPI
    ).extract();
  }
}

class ElsevierJournalExtracter {
  private volumePage!: Page;
  private issuePage!: Page;
  private articlePage!: Page;
  private orcIdPage!: Page;

  constructor(
    private browser: ConstrainedBrowser,
    private journalURL: string,
    private emailPlaceAPI: ExtracterUtilsAPI
  ) {}

  async extract() {
    this.volumePage = await this.browser.newPage();
    // this.issuePage = await this.browser.newPage();
    // this.articlePage = await this.browser.newPage();
    // this.orcIdPage = await this.browser.newPage();

    await this.extractFromJournal();
  }

  private provideArticleURL(articlePath: string) {
    return `${ElsevierExtracter.ELSEVIER_BASE_URL}/${articlePath}`;
  }

  /**
   * Extract different articles in issue and authors data that articles page
   * @param issuePage
   */
  private async processIssuePage() {
    await this.volumePage.waitForSelector('h3 a.anchor', { timeout: 3000 });

    // Extract Articles
    const articleLinks = await this.volumePage.$$eval('h3 a.anchor', (res) =>
      res.map((a) => a.href)
    );

    for (let articleLink of articleLinks) {
      // const articleURL = this.provideArticleURL(articleLink);

      await this.volumePage.goto(articleLink);

      const authorTitles = await this.volumePage.$$(
        '.author-group span.button-link-text'
      );

      const emails: string[] = [];

      for (let at of authorTitles) {
        const authorName = await at.evaluate(
          (a) => (a.click(), a.querySelector('.given-name')?.textContent),
          at
        );

        // wait to side panel open and data loaded
        await this.volumePage.waitForSelector('#side-panel-author .given-name');

        const emailAddressElmnt = await this.volumePage.evaluate(() =>
          document.querySelector('#side-panel-author .e-address')
        );

        if (emailAddressElmnt) {
          const email =
            emailAddressElmnt.firstElementChild?.lastElementChild?.textContent?.trim();

          if (email) {
            this.emailPlaceAPI.addEmail(email);
          }
        } else {
          try {
            const orcidPageLink = await this.volumePage.$eval(
              '#side-panel-author a.anchor.orcid-link',
              (e) => e.href
            );

            // handle OrcId page

            await this.orcIdPage.goto(orcidPageLink);

            const email = (
              await this.orcIdPage.$eval(
                '#emails-panel .row-with-privacy',
                (e) => e.textContent
              )
            )?.trim();

            if (email) this.emailPlaceAPI.addEmail(email);
          } catch (err) {
            // no orcid page available **OR** No email existed in orcid page
            console.error('ORCID FAILED');
          }
        }
      }

      // articlePage;
    }
  }

  private async processVolumePage(volNum: number, lastIssueNum?: number) {
    // if number of issues didn't specified, then extract it
    if (!Number.isInteger(lastIssueNum)) {
      const latestIssueAvailableURL = this.provideJournalVolumesIssueURL(
        volNum,
        50
      );

      await this.volumePage.goto(latestIssueAvailableURL);

      // calculate the actual number of issue
      const issuePageTitle = await this.volumePage.evaluate(
        () => document.querySelector('.u-text-light.js-vol-issue')!.textContent!
      );

      lastIssueNum = +issuePageTitle.match(/\bIssue\s+(\d+)$/)!.at(1)!;

      // process last issue of volume for extracting articles
      await this.processIssuePage();

      lastIssueNum -= 1;
    }

    // process issues
    for (let issueNum = lastIssueNum!; issueNum > 0; issueNum--) {
      await this.volumePage.goto(
        this.provideJournalVolumesIssueURL(volNum, issueNum)
      );
      await this.processIssuePage();
    }
  }

  async extractFromJournal() {
    // Generate number of last issue, It is almost impossible that there is more than 50 Volume(publish years) and 50 issue in journal.
    // Also if the last volume and issue number was less than 50 then the elsevier return the actual last volume and issue.
    const lastVolumeIssueURL = this.provideJournalVolumesIssueURL(50, 50);

    await this.volumePage.goto(lastVolumeIssueURL);

    const journalLatestIssueTitle = await this.volumePage.evaluate(
      () => document.querySelector('.u-text-light.js-vol-issue')!.textContent! // format :  Volume X, Issue Y
    );

    const lastVolIssTitleParse = journalLatestIssueTitle!.match(
      /\bVolume\s+(\d+)\s*,\s*Issue\s+(\d+)$/
    )!;

    const lastVolumeNumber = +lastVolIssTitleParse.at(1)!; // last volume number
    const lastIssueOfVolumeNumber = +lastVolIssTitleParse.at(2)!; // number of last issue of last volume

    await this.processVolumePage(lastVolumeNumber, lastIssueOfVolumeNumber);

    for (let volNum = lastVolumeNumber - 1; volNum > 0; volNum--) {
      await this.processVolumePage(volNum);
    }
  }

  private provideJournalIssuesURL() {
    return `${ElsevierExtracter.ELSEVIER_BASE_URL}/journal/${this.journalURL}/issues`;
  }

  private provideJournalVolumesIssueURL(volNum: number, issueNumber: number) {
    const url = new URL(this.journalURL);
    if (!this.journalURL.includes('vol')) {
      url.pathname += `/vol/${volNum}`;
    }
    if (!this.journalURL.includes('issue')) {
      url.pathname += `/issue/${issueNumber}`;
    }
    return url.toString();
    // return `${ElsevierExtracter.ELSEVIER_BASE_URL}/journal/${this.journalURL}/vol/${volNum}/issue/${issueNumber}`;
  }
}
