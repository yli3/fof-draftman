## Introduction
This is a draft management utility for FOF 7, an American football text simulation game by Solecismic Software. An online version [may be accessed here](http://www.simgamingnetwork.com/osfl/utilities/draftman/).

The game generates players a class of ~850 rookie draft prospects every season. This utility provides a clean interface to manage players of interest in a draft class. 

It was conceived to provide an easier way to separate players into bins (Round 1 through 7, plus FA), as well as to take notes and to highlight key prospects, in a multiplayer draft setting. Also a neat exercise in exploring Javascript for me!

## Usage
Draftman reads game-generated CSV files, and uses browser-local IndexedDB storage to maintain work. Therefore, clearing data will result in a loss of your work!

Use the "Save" and "Load" features to save the state of the current draftman database to your computer. A sample save of a newly generated class is provided; load it with the [online version](http://www.simgamingnetwork.com/osfl/utilities/draftman/) to sample the utility.

## Next steps
* Update UI. The original usage paradigm was revealed to be too complicated. Practically, the only functions are "Import New", and "Update Existing" (and load/save). Currently there are a lot of different import behaviors that might update only parts of the DB.
