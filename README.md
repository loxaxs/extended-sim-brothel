# ESB - Extended Sim Brothel

## Downloading the game images

The game images are held in a separate repository: esbpic. To build the game,
you'll need to clone the esbpic repository in the root folder of the extended-sim-brothel repository.

```bash
# cd extended-sim-brothel/
git clone git@github.com:loxaxs/esbpic.git
```

## Description

This just one more sim brothel management game. It is heavily inspired from the well known Hentai Sim Brothel flash game (HSB), with more girls, more images and the with an improved usability of the UI.

I might also make a pony version of it if I find the time to.

## Detailed description

Here is a more in-depth description of the game mechanics which differ from HSB or not:

- The game time step is still the day: You plan what each girl will do and validate the day to see the results. It is still possible to save the game before or after spending a day.
- The girl aquisition mechanic has been simplified: There's now only one way to obtain new girls, not four. You can only get them from the market.
- I'm still thinking of having six buildings where you can have business, but I'd like to add a limitation that only two of them can be active at the same time. Also, the buildings would be rented, not bought. Except maybe the two most prestigious buildings could be bought as an achievement. I might add a rental system to make it more interesting.
- The final goal of the game would not be the brothel business itself, but rather to own as many horses as possible. The brothel business would just be a way to get money to buy and care for horses. Or alternatively, the money would be donated to some non-profit organizations chosen by the player.

Girl-related mechanics:

- In HSB, girls have two distinct sex-related characteristics. These are Fuck and Blowjob. I plan on merging them into a single one "Sex" characteristic. Still, there would be a history of how many times a girl has had which kind of activity while working in the Brothel. The activity chart would be extremely detailed, distinguishing up to the positions in which they had sex. The exact span of that chart is to be determined. Practicallity matters.

- Some activities would be impressive to the girls, so they might refuse to practice them if they have never done it before. This would be the case with:
  - Possibly vaginal sex for some very shy girls
  - Anal sex
  - Deep throat
  - Double penetration (vaginal and anal)
  - Gangbangs

Note: the game would keep track of vaginal, anal and throat virginity and also report virginity loss when it happens.

## Girl characteristics

In HSB, the girls have the has the following ten characteristics: **Charisma, Constitution, Character, Reputation, Joy, Fuck, Blowjob, Libido, Health, Refinement**

- **Charisma** is a better word for Beauty, so I think I'll keep it
- **Constitution**, or strength relates well to the number of customer a girl can take care of. I think I'll keep it
- **Character** is a nice mechanic for girls refusing to work. I'll probably keep it, but I think I'll rework it.
- **Reputation** is an interesting characteristic which goes together with refinemenent. I think I'll keep at least one of these two characteristics but I might change how they work
- **Joy** is interesting, but it might be superfluous. I might remove it
- **Libido** is interesting, ~~but it might be superfluous as well. I might remove it as well~~ I've decided I'll keep it
- **Health** is interesting and a very common stat in sex management games. I'll keep it.
- **Refinement** is unique to HSB and is interesting. I think I'll take some inspiration from it, but it won't be kept as-is.

### Charisma, beauty and prominence

The charisma of a girl is the sum of her natural **beauty** and her acquired **prominence**. The charisma of a girl influences how strongly she attracts people to the establishment she works in, as well as how much she will be asked for by customers in this establishment. Charisma can be buffed by wearing items

### Libido, constitution and health

The libido inflences the number of customers a girl can work with each day. However, if her health or constitution is too low, the number of customers she can work with can be limited. The constitution also influences how much health a girl earn when resting for a day. If the health of a girl goes too low, she may become completely unable to work.

Furthermore, low health girls will quickly loose libido. Very healthy girls slowly gain libido over time. It is possible to increase libido temporarily and permanently by using drugs, but low commitment girls are more likely to refuse to take drugs.

### Character, integralism and commitment

Girls with low commitment are likely to refuse to work. Girls with high character are more likely to refuse to engage in activities they have never practised; one could say they are "integralist". While commitment can be aquired through training, character is a natural trait that cannot be worn down.

### Sex

The ability of a girl to provide customers with satisfactory sexual services depends on the "Sex" characteristic. Together with the charisma, it influences the satisfaction of the customer, and thus the reputation of the girl.

### Reputation and fame

The recognition of a girl is aquired throught time and through experience she has with customers. It is composed of the fame and the reputation. The reputation tracks the sum of the charisma and sex characteristics. The fame describes how many customers know her or have heard about her. The fame simply grows with experience. The reputation of a girl varies a bit more slowly when she is famous, be it positively or negatively.

The price that can be charged for a girl depends a lot on her reputation famous girls will also attract more customers.

## Other girl-related mechanisms

HSB has a system of experience gained by girls which can be used to level up other stats. This mechanism won't be kept in ESB. Instead, variable stats will change either through experience (e.g. Sex), or through training (e.g. Constitution, Prominence) or through other dedicated activities (e.g. Commitment).

## Technical details

Girls images will need to be stored into one folder: images. Girl images can be in any arrangmenent folders and subfolders, but the file will need to follow a specific naming scheme. One of:

- `<girl-name>--<comma-separated-tags>--<author>.<ext>.pic` (the default format)
- `<girl-name>--<comma-separated-tags>--<author>.pic.<ext>` (the second format)

The default format makes the images not be visible right away in the explorer of the user. The second format allows the user to have visible images if they want to. Images will be detected by the presence of the `.pic` extension, so that malformed names will produce a warning upon game launch.

To be considered valid, a girl needs to have at least two images: One for every-day life (tag category "base": dancing, happy, tired or unhealthy) and one for sex (tag category "explicit"). Ideally there would be at least four or five vaginal sex images by girl: This allows to show one image for each customer they had during the day. Depending on the activities the girl had which each customer and depending on what image tags are available, the game will choose an appropriate set of images to show.

### Image categories and tags

Using a full fledged tag system makes sense. So far I've identified the following categories and tags as useful:

- Mini -- M
- Base (~safe or sensitive) -- A
  - dancing
  - happy
  - tired
  - unhealthy
- Explicit
  - Sex or imminent sex -- X
    - Sexual activity
      - vaginal
      - anal
      - Oral
        - oral
        - deepthroat
        - other_oral_sex
      - Handjob
        - handjob
        - footjob
        - other_hand_sex
      - masturbation
      - gangbang
      - other_sexual_activity
    - Object insertion
      - Vaginal insertion
        - vibrator (inserted vaginally)
        - dildo (inserted vaginally)
        - other_vaginal_insertion
      - Anal insertion
        - plug (inserted anally)
        - anal_beads (inserted)
        - anal_tail (inserted)
        - other_anal_insertion
    - tentacle
  - Display
    - Sexy
      - sexy_up
      - sexy_back
    - Nude
      - nude_up
      - nude_laying
      - nude_spread
    - bondage

Please note that several tags can apply simultaneously.

If a tag is empty or does not have enough images to fulfil a request, images must be drawn among the images of all the sets of the parent category.

## Girls from HSB

I found the following paragraph on the Newgrounds page of HSB:

> Big Breasts - Urd, Tifa, Nico Robin, Nami, Mikuru, Ayane, Lulu, Matsumoto, Orihime (Basically free advertising)
> Lolita - Skuld, Shinobu, Sasami, Sakura, Chihiro (May gain 1 CHARISMA daily)
> Happiness - Rikku, Yuffie, Osaka, Sasami, Talim, Matsumoto, Orihime (Gain 1 JOY daily)
> Lucky - Haruhi, Naru, Osaka, Talim, Orihime (Less harmful events)
> Famous - Aerith, Rikku, Yuna, Nico Robin, Ayeka, Zelda, Nami (Doesn't work)
> Noble - Belldandy, Skuld, Urd, Hinata, Yuna, Ayeka, Rinoa, Zelda, Sasami, Deedlith (Gain 1 REFINEMENT daily)
> Excellent - Aerith, Rikku, Yuna, Rei, Ayeka, Rinoa, Talim, Zelda, Deedlith(Always max customers)
> Catgirl - Haruhi, Naru, Ranma, Sakura, Mikuru, Fran (CHARISMA and sex stats locked at 100)

It lists 33 different girls in total:

- Aerith
- Ayane
- Ayeka
- Belldandy
- Chihiro
- Deedlith
- Deedlith
- Fran
- Haruhi
- Hinata
- Lulu
- Matsumoto
- Mikuru
- Nami
- Nami
- Naru
- Nico Robin
- Orihime
- Osaka
- Ranma
- Rei
- Rikku
- Rinoa
- Sakura
- Sasami
- Shinobu
- Skuld
- Talim
- Tifa
- Urd
- Yuffie
- Yuna
- Zelda
