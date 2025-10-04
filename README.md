# FAP
profitz.



# Prompt

hi. let's create an app. 

i want to create it using Typescript and expo. 

the app is very simple - it tracks the amount of money i'm making selling Free Action Potions in world of warcraft's auction house. 

some background - i either buy or fish for a fish called Oily Blackmouth.
i use two of those to create Blackmouth Oil. i then use two Blackmouth Oil and one Stranglekelp (which is a herb) to create the potion.
a stranglekelp typically costs 4g, a fish typically costs 10g and a potion sells for around 44g.
i'm taxed 5% on any sale i make. 

i want to be able to track the amount of money i've spent (buying fish and stranglekelp - i want to track both separately and together) vs the amount of money i've made (selling potions). 
i want to be able to track how many fish i've fished and how many potions i've sold off of fish i fished instead of buying. 

you can use more files in order to create a better codebase (enums, env etc). 
please build the app, and guide me through how i can get it built on my phone. 

# Pre - Prompt

could you guide me through how to prompt you to get the response that best suits my needs? here is my prompt: *copy prompt* 

# Updated Prompt:

Hi! I'd like you to create a React Native app using TypeScript and Expo 
to track my World of Warcraft auction house profits.
**Background:**
I craft Free Action Potions to sell. The recipe is:
- 2 Oily Blackmouth fish → 1 Blackmouth Oil
- 2 Blackmouth Oil + 1 Stranglekelp → 1 Free Action Potion
**Typical Costs:**
- Oily Blackmouth: 10g each (when bought)
- Stranglekelp: 4g each
- Free Action Potion: sells for ~44g (minus 5% auction house tax)

**Core Features:**
1. Log transactions:
   - Fish purchases (quantity, cost per unit)
   - Fish caught while fishing (quantity, total cost saved by fishing)
   - Stranglekelp purchases (quantity, cost per unit)
   - Potion sales (quantity, price per unit)
   - Average Cost per Fish
   - Average Price per potion
   - Note - by default use the typical costs, but i should be able to change the cost/price when inserting the amount of fish bought or potions sold (for example, if i buy 5 fish for 5 gold each, i'd want to be able to log that).
2. Dashboard showing:
   - Total money spent (separate totals for fish vs stranglekelp)
   - Total money earned from potion sales
   - Net profit/loss
   - Number of potions made from fished vs bought materials
3. Stock graph that displays my stock over time.
**Technical Requirements:**
- Use TypeScript throughout
- Use AsyncStorage for data persistence
- Clean, mobile-friendly UI
- Organized code structure (separate files for types, constants, etc.)
**Deliverables:**
- Complete source code
- Step-by-step setup instructions
- Instructions for running on my phone (iOS/Android)
I'm comfortable with React Native. 