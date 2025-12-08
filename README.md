# 🔍 TFD Trade Market Helper — Chrome Extension
A modern, stylized enhancement for **The First Descendant** Trade Market, built to fix the limitations of the official site and give players powerful filtering, sorting, and analysis tools.

This extension captures all market results automatically, parses them, and displays them in a **fast**, **readable**, **interactive**, and **modern UI**.


## Ancestor Module Mode
<img width="2560" height="1271" alt="image" src="https://github.com/user-attachments/assets/54ed2f8f-d8b7-4dce-ab63-bdf875b3e0e5" />



## Trigger Module Mode
<img width="1080" height="536" alt="image" src="https://github.com/user-attachments/assets/6b1860fd-0cc4-4642-98d0-0bc28a306297" />


---

## ✨ Why This Was Made
The official TFD market page is visually appealing but **extremely inefficient** to use:
  
- No bulk viewing or advanced filtering  
- No way to exclude specific negative stats  
- Hard to compare items at a glance  
- No grid view, no sorting by important metrics  
- No dedicated UI for Ancestor vs Trigger modules

This extension fixes all of that and more.

---

## 🚀 Key Features

### 🧠 Intelligent Data Capture
- Auto-scrolls through the entire results page  
- Waits for The First Descendant’s lazy-loader to finish  
- Detects market mode (Ancestor or Trigger Modules)  
- Parses every card into structured, filterable data

### 🎯 Module-Specific Filtering
#### **Ancestor Modules**
- Search by positive skill attributes  
- Exclude negative attributes  
- Filter by:  
  - Socket type  
  - Mastery Rank  
  - Seller MR  
  - Rerolls  
  - Status (Online / Offline)  
  - Price range  
  - Listing age (hours/days)

#### **Trigger Modules**
- Auto-detects the module’s two attributes  
- Provides min/max % filters for each attribute  
- No unnecessary filters shown  
- Perfectly tuned for Trigger-style results

### 🎨 Fully Modernized Interface
- Dark-mode UI with tasteful lighting  
- Soft neon accents & frosted-glass panels  
- Animated hover + interaction states  
- Responsive layout  
- Themed scrollbars  
- Matching gradients between sidebar, header, and grid

### 🧹 Smart Inventory Controls
- Clear button for main attribute search  
- Clear button for negative attribute search  
- Smooth dropdowns, tag-style selection chips  
- Centered filter chips beneath each bar  
- Dynamic spacing & alignment for text & filter blocks

### 🛒 Convenient Seller Tools
- Click-to-copy seller name  
- Seller MR visually emphasized  
- Status icons color-coded  
- Clean card layouts for quick scanning

---

## 🧩 Installation (Developer Mode)
This extension is not distributed via the Chrome Web Store yet. To install:

### 1️⃣ Download the Repository
Clone or download the ZIP from GitHub:

```bash
git clone https://github.com/syphari/tfd-market-helper.git
```

Or download ZIP from "Releases" here on Github → Extract folder on PC locally.

### 2️⃣ Enable Developer Mode
Open Chrome  
Go to: `chrome://extensions/`  
Toggle **Developer Mode** (top right)

### 3️⃣ Load the Extension
Click **Load unpacked**, then select the folder containing:

- `manifest.json`  
- `popup.html`  
- `popup.js`  
- `helper.js`  
- `market_helper.html`  
- `(icons)`

Chrome will load the extension immediately.

---

## 🕹️ How to Use

### 🟪 1. Go to the Official Trade Market  
Visit: https://tfd.nexon.com/en/market  

### 🟪 2. Enter the name of your module and then apply your filters on the official page  
Choose:  
- Module type  
- Socket  
- Platform  
- Search term  
- Sorting  

### 🟪 3. Click the Extension Icon  
A popup appears explaining that autoscroll will begin.

You must confirm:  
- **I have set my filters**  
OR  
- **I need to adjust them**

### 🟪 4. Autoscroll Begins  
The extension will:  
- Automatically scroll to the bottom  
- Detect hidden lazy-loaded rows  
- Parse every module into structured data  
- Opens the modern helper interface  

### 🟪 5. Explore the Transformed Market  
You now get:  
- Grid layout  
- Module-type-specific filters  
- Attribute search  
- Negative attribute exclusion  
- Adaptive card sizing  
- Sorting controls  
- Real-time filtering  

- Note: For trigger modules please only filter for one specific module at a time and not an unfiltered list of different modules
- For example - just all "Power Beyond" and not the mixed list of power beyond with kuiper hollow points for example this is due to how it dynamically allocates the min/max filter for trigger modules 
- Ancestor modules however can be mixed so its fine for the ancestor module mode just not trigger modules 


---

## 📦 Project Structure
```
TFD-Market-Helper/
│── manifest.json
│── popup.html
│── popup.js
│── helper.js
│── market_helper.html
│── icon16.png
│── icon48.png
│── icon128.png
```

---

## 🛠️ Tech Stack
- Vanilla JS  
- Tailwind-inspired custom CSS  
- Chrome Extension APIs  
- DOM Parsing + Mutation Observers  
- No frameworks required  

---

## 🧭 Notes & Limitations
- The extension **does not hook into Nexon's API**.  
- All data comes from the rendered DOM after autoscroll.  
- Must load results fully on the official site before processing.

---

## ❤️ Special Thanks
I hope this tool is helpful for the community!


---

## 📜 License
MIT License = free to modify and distribute.

---

## ⭐ If you like this project...
Don't forget to **star the repo** and share it with other Descendants!

