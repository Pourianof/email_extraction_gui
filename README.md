# Academic Author Extractor

A desktop application built with **Electron**, **Vanilla JavaScript**, and **EJS** for extracting academic author information from major scientific publishers.

The application allows users to collect author metadata by either providing direct publication URLs or performing keyword-based searches across supported journal platforms and Google Scholar.

## Supported Publishers

- Elsevier
- Wiley
- Springer
- Taylor & Francis
- World Scientific

## Features

### URL-Based Extraction

Extract author information directly from publisher URLs, including:

- Journal Issues
- Volumes
- Publication Pages
- Individual Article Pages

The application automatically processes the provided URL and retrieves the available author information from the corresponding publication.

### Keyword-Based Search

The application provides built-in search functionality that allows users to:

- Search publications using custom keywords within supported publisher platforms.
- Search academic content through Google Scholar.
- Extract author information from discovered results.

### Multilingual Interface

The application supports both:

- English
- Persian (Farsi)

allowing users to switch between languages according to their preference.

## Architecture

This project utilizes a dedicated scraping engine that is maintained as a separate repository.

Scraper Repository:

- https://github.com/Pourianof/email_extracting

The desktop application acts as a user-friendly interface on top of the extraction engine, providing URL processing, search capabilities, and result management.

## Technology Stack

- Electron
- Vanilla JavaScript
- EJS
- Node.js

## Use Cases

- Academic data collection
- Research author discovery
- Publication analysis
- Author metadata extraction from scientific journals

## Disclaimer

This project is intended for research and academic purposes. Users are responsible for complying with the terms of service and usage policies of the respective publishers and platforms.
