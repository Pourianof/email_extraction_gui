import BaseExtracter from './baseExtracter';

export default class WileyExtracter extends BaseExtracter {
  async extract(): Promise<void> {
    const journalsPage = await this.browser.newPage();
    // go to main pages of journals
    // in categories of computer science and electrical engineering journals
    await journalsPage.goto(
      'https://onlinelibrary.wiley.com/action/showPublications?ConceptID=68&PubType=journal&startPage=&ConceptID=90&pageSize=50'
    );

    // Extract available journals
    const journalsURL = await journalsPage.$$eval(
      '.search__item .item__body .meta__title.meta__title__margin > a.visitable',
      (links) => links.map((l) => l.href)
    );

    // Go into specific journal's volumes page
    for (let j of journalsURL) {
      const journalURL = new URL(j);
      const journalId = journalURL.pathname.split('/').at(-1)!;
      journalURL.pathname = `loi/${journalId}`;

      await journalsPage.goto(journalURL.toString());

      const availableVoumes = await journalsPage.$$eval(
        '.loi--aside__left span.loi-tab-item',
        (volumes) =>
          volumes.map((v) => (v.parentElement! as HTMLAnchorElement).href)
      );
      // TODO : Current page we extracting available volumes is containing last volume issues
      // Then we can prevent loading this page again(but i think puppeteer wont do total reloading)
      // and process the loaded data and iterate and load over other volumes

      for (let v of availableVoumes) {
        await journalsPage.goto(v);
        const issuesLink = await journalsPage.$$eval(
          '.loi__issue .parent-item > a',
          (issues) => issues.map((i) => i.href)
        );

        for (let il of issuesLink) {
          // go to issue page
          await journalsPage.goto(il);

          const articlesLink = await journalsPage.$$eval(
            '.issue-item a.issue-item__title',
            (articles) => articles.map((a) => a.href)
          );

          // Go to articles pages
          // iterate over articles of each issue
          for (let articleLink of articlesLink) {
            await journalsPage.goto(articleLink);

            const emails = await journalsPage.$$eval(
              'a.sm-account__link',
              (links) =>
                links
                  .filter((l) => l.href.startsWith('mailto'))
                  .map((l) => l.href.substring(7)) // remove first 7 character of mailto:
            );

            await this.utilsAPI.addEmail(emails);
          }
        }
      }
    }
  }
}
