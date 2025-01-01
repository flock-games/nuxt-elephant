# White Elephant Nuxt App

This project was built in 4(ish) hours for the [Learn With Jason Hackathon 10](https://www.learnwithjason.dev/blog/web-dev-challenge-hackathon-s1e10-workshop-woes).

The challenge was to build an app using [Sanity](https://www.sanity.io/) to help Santa in the busy Christmas season.

This app is a very simple gameplay demo of a white elephant using data stored and managed by a Sanity Content Lake. In its hackathon form, a single user would act as the host. A multiplayer version with live data for all users would be the natural extension, complete with auth. 

A pre-event phase of configuring the game and allowing users to submit their gifts would be fun, too.

For now, the Sanity admin tools made it easy to populate with sample data so I could focus on the core loop of unwrapping gifts, stealing, and the general Christmas angst only white elephants can provide.

> npm install

> npm run dev

To use this with your own Sanity project, update `nuxt.config.ts` with your project's `projectId` and define a `SANITY_API_TOKEN` in your `.env` file.