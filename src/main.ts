'use strict';

let z = 100;

function addToZ (x, y) {
    return x + y + z;
}

console.log( addToZ(80, 90) );

interface Card {
    suit: string;
    card: number;
}

interface Deck {
    suits: string [];
    cards: number [];
    createCardPicker (this: Deck): () => Card; 
}

let deck: Deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    // 注意：此函数现在显式地指明了其被调必须是类型`Deck`（NOTE: The function now explicitly specifies 
    // that its callee must be of type Deck）

    createCardPicker: function (this: Deck) {
        return () => {
            let pickedCard = Math.floor (Math.random() * 52);
            let pickedSuit = Math.floor (pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker ();
let pickedCard = cardPicker ();

console.log("Card: " + pickedCard.card + " of " + pickedCard.suit);

