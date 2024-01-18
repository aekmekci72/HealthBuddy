const puppeteer = require('puppeteer');
const db = require('./db/db_connection.js');
const express = require('express');

const app = express();

(async () => {
    const insert_diseases_data = `
        INSERT INTO diseases 
            (name, symptomsOccurrence, geneticEffects) 
        VALUES 
            (?, ?, ?);
    `;
    const insert_symptoms_data = `
        INSERT INTO disease_symptom_xref
            (disease, symptom, frequency) 
        VALUES 
            (?, ?, ?);
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const baseURL = 'https://rarediseases.info.nih.gov/diseases?category=Birth%20Defects%3BBlood%20Diseases%3BCancer%3BEndocrine%20Diseases%3BGastrointestinal%20Diseases%3BGenetic%20Diseases%3BInfectious%20Diseases%3BKidney%20Diseases%3BNeurological%20Diseases%3BRespiratory%20Diseases%3BSkin%20Diseases%3BUrinary%20and%20Reproductive%20Diseases&page=';

    let currentPage = 72;
    let hasNextPage = true;

    while (hasNextPage) {
        const currentUrl = `${baseURL}${currentPage}&letter=&search=`;
        console.log(`Navigating to page ${currentPage}: ${currentUrl}`);

        await page.goto(currentUrl);

        const diseaseLinks = await page.evaluate(() => {
            const links = [];
            const diseaseElements = document.querySelectorAll('body > app-root > ng-component > div.container-fluid.pt-3.mb-0.gray-bg > div > div > div > div > div.col-md-7.col-lg-8.col-xl-9 > div.results.pt-md-2 > div > div > a');
            diseaseElements.forEach(element => {
                links.push(element.href);
            });
            return links;
        });

        const currentDiseaseUrl = diseaseLinks[0];
        try {
            await page.goto(currentDiseaseUrl, { timeout: 10000 });
        
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                page.waitForSelector('body > app-root > app-disease-about > main-banner > div > div.position-relative.all.banner-image-cover.header-section > div > div.container-xxxl.banner-content.align-items-center.pt-lg-5.mt-lg-4 > div > div > div > h1', { timeout: 2000 })
                    .catch(() => null), 
                page.waitForSelector('#age-at-onset > div > div.container-xxxl.pt-5.pt-md-5.mb-md-5 > div > div.col-xl-8 > div > div.lower-text.mt-5.d-flex.justify-content-center.fs-md-18', { timeout: 2000 })
                    .catch(() => null), 
                page.waitForSelector('body > app-root > app-disease-about > inheritance > div > div > div > causes-tabs > div.d-flex.d-lg-none.flex-column.mobile-tabs-container.pt-2 > div > ul > li > button', { timeout: 2000 })
                    .catch(() => null),
                page.waitForSelector('#symptoms > div:nth-child(1) > div > div.row.pb-4.pb-xl-5 > div.col.col-xl-9 > div > div.carousel-main', { timeout: 2000 })
                    .catch(() => null),
                page.waitForSelector('div:nth-child(1) > div > div.row.pb-4.pb-xl-5 > div.col.col-xl-9 > div > div.list-item-wrapper.row.mt-2.w-100.mx-0.px-0 > div:nth-child(1) > div.col-3.fw-bold.fs-22.text-maroon.py-4.ps-4', { timeout: 2000 })
                    .catch(() => null),
                    
                        
            ]);
            await page.waitForSelector('#symptoms > div:nth-child(1) > div > div.row.pb-4.pb-xl-5 > div.col.col-xl-9 > div > div.list-item-wrapper.row.mt-2.w-100.mx-0.px-0 > div', { timeout: 2000 }).catch(() => null);

            const selector1 = 'body > app-root > app-disease-about > main-banner > div > div.position-relative.all.banner-image-cover.header-section > div > div.container-xxxl.banner-content.align-items-center.pt-lg-5.mt-lg-4 > div > div > div > h1';
            const name = await page.evaluate((selector1) => {
                const nameElem = document.querySelector(selector1);
                return nameElem ? nameElem.textContent.trim() : 'N/A';
            }, selector1);
            console.log(name);
            const selector = '#age-at-onset > div > div.container-xxxl.pt-5.pt-md-5.mb-md-5 > div > div.col-xl-8 > div > div.lower-text.mt-5.d-flex.justify-content-center.fs-md-18';
            const symptomsOccurrence = await page.evaluate((selector) => {
                const symptomElement = document.querySelector(selector);
                return symptomElement ? symptomElement.textContent.trim() : null;
            }, selector);
            console.log(symptomsOccurrence)

            const geneticEffects = await page.evaluate(() => {
                const geneticEffectElements = document.querySelectorAll('body > app-root > app-disease-about > inheritance > div > div > div > causes-tabs > div.d-flex.d-lg-none.flex-column.mobile-tabs-container.pt-2 > div > ul > li > button');
                const effects = [];
                geneticEffectElements.forEach(element => {
                    effects.push(element.textContent.trim());
                });
                return effects;
            });
            console.log(geneticEffects);
        
            const geneticEffectsString = geneticEffects.length > 0 ? geneticEffects.join(', ') : 'None';
        

            const carouselContainerSelector = '#symptoms > div:nth-child(1) > div > div.row.pb-4.pb-xl-5 > div.col.col-xl-9 > div > div.carousel-main > div.carousel-container.pt-3';
            const slideSelector = `${carouselContainerSelector} > div.carousel-slide`;
            const nextButtonSelector = '#symptoms > div:nth-child(1) > div > div.row.pb-4.pb-xl-5 > div.col.col-xl-9 > div > div.carousel-main > div.d-xl-none.mobile-prev-next-buttons > button.icon-gard-arrow-right.btn.btn-outline-white.nav-button';

            const extractCarouselData = async () => {
                const symptomCountSelector = '#symptoms > div:nth-child(1) > div > div.row.pt-0.pb-2.text-white > div > p';
                    
                const symptomCountText = await page.evaluate((selector) => {
                    const element = document.querySelector(selector);
                    return element ? element.textContent.trim() : '';
                }, symptomCountSelector);

                const symptomCount = parseInt(symptomCountText.match(/\d+/)[0], 10);


                const symptomCountToFetch = symptomCount; // You can change this number as needed
                const extractedData = [];
                
                for (let i = 0; i < symptomCountToFetch; i++) {
                    await page.waitForSelector(carouselContainerSelector);
                
                    const symptomData = await page.evaluate((slideSelector) => {
                        const slides = document.querySelectorAll(slideSelector);
                        const extractedData = [];
                
                        slides.forEach(slide => {
                            const name = slide.querySelector('.symptom-list-header h3').textContent.trim();
                            const frequency = slide.querySelector('.symptom-list-frequency.fs-7.fs-md-6 > symptoms-section-frequency-slider > div.wrap > div.frequency-wrap > div.marker-text.d-none.d-md-block > div').textContent.trim();
                            extractedData.push({ name, frequency });
                        });
                
                        return extractedData;
                    }, slideSelector);
                
                    extractedData.push(...symptomData);
                
                    const nextButton = await page.$(nextButtonSelector);
                    if (!nextButton) {
                        break; 
                    }
                
                    await nextButton.click();
                    await page.waitForTimeout(1000); 
                }
                
                return extractedData;
            };
                
            const carouselData = await extractCarouselData();
            console.log(carouselData);
                
        
                                
                
            db.execute(insert_diseases_data, [name, symptomsOccurrence, geneticEffectsString], (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Disease data inserted successfully");
                }
            });

            for (let j = 0; j < carouselData.length; j++) {
                const symptom = carouselData[j];
                db.execute(insert_symptoms_data, [name, symptom.name, symptom.frequency], (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Symptom data inserted successfully");
                    }
                });
            }

        } catch (error) {
            console.error(`Error processing ${currentDiseaseUrl}: ${error.message}`);
            currentPage+=20
            continue;
        }
    

        const s = '#body > app-root > ng-component > div.container-fluid.pt-3.mb-0.gray-bg > div > div > div > div > div.col-md-7.col-lg-8.col-xl-9 > div.d-flex.d-xl-block.justify-content-between.align-items-center.pb-5 > div > a:nth-child(9)';
        const nextButton = await page.evaluate((s) => {
            const elem = document.querySelector(s);
            return elem ? elem.textContent.trim() : 'N/A';
        }, s);
        hasNextPage = nextButton !== null;

        if (hasNextPage && currentPage < 380) {
            currentPage+=20;
        } else {
            console.log("No more pages");
            break;
        }
    }

    await browser.close();
})();

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});