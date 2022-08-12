import React from "react";

import classes from "./Hero.module.scss";

interface HeroProps {
  text: { heading: string; paragraph: string };
}

const Hero: React.FC<HeroProps> = ({ text }) => {
  return (
    <section className={classes.hero}>
      <div className={classes.hero__inner}>
        <div className={classes.hero__text}>
          <h1 className={classes["hero__text-heading"]}>{text.heading}</h1>
          <p className={classes["hero__text-paragraph"]}>{text.paragraph}</p>
        </div>
        <div className={classes.hero__calculator}>
          <div className={classes["hero__calculator-inner"]}>
            loreCupidatat minim eu proident Lorem. Occaecat in adipisicing nisi proident eu ut eu
            tempor voluptate ad. Aute esse ex nostrud sit proident. Aute enim eiusmod sit nulla
            minim. Labore magna elit est quis ipsum id et occaecat ex ad consequat officia ad aute.
            Proident est exercitation ex sint dolor exercitation elit aliquip elit nostrud dolore
            aliqua. Minim pariatur qui amet irure consectetur. Consectetur nostrud deserunt labore
            ullamco ipsum occaecat. Mollit amet ex eiusmod incididunt. Esse ex qui exercitation esse
            ut sit aliquip nostrud est eu. Officia elit ullamco aute officia officia qui cillum
            aliquip duis cupidatat cillum sunt. Excepteur qui elit consequat deserunt est excepteur
            laboris ad consequat incididunt velit elit cillum. Ut culpa deserunt deserunt laboris
            incididunt deserunt duis laboris irure irure ipsum fugiat Lorem eu. Sunt tempor laboris
            ea aute laborum. Ut qui est et laborum anim exercitation occaecat labore ipsum mollit
            duis. Velit et eu cillum et labore officia est. Ut sint nostrud incididunt consequat
            fugiat. Pariatur do duis consequat veniam elit sint minim quis id sit minim labore
            ipsum. Magna sint aliqua laborum sit sunt. Do irure laboris minim ex laboris veniam
            irure consectetur eu esse tempor. Velit cupidatat duis incididunt dolor officia duis.
            Labore quis nostrud quis sunt adipisicing culpa deserunt. Fugiat est duis dolor eu anim
            duis aliqua consequat incididunt. Tempor laboris voluptate ullamco aute magna incididunt
            culpa ex magna ut Lorem cupidatat et. Adipisicing aute laboris ipsum fugiat. Nostrud
            veniam minim officia excepteur voluptate occaecat pariatur sit laborum. Aute dolor ea
            dolore eiusmod eiusmod quis ullamco proident qui pariatur adipisicing velit. Et ea
            nostrud enim in fugiat proident quis id incididunt sit laborum cillum commodo pariatur.
            Quis adipisicing laborum do dolore ea esse consequat laborum. Fugiat id sit adipisicing
            minim ut eiusmod irure ullamco id culpa laboris adipisicing sit Lorem. Quis aute officia
            qui incididunt quis enim enim do tempor nisi. Ea proident ex Lorem nostrud cupidatat id
            aliqua laboris in quis ut. Eu officia culpa reprehenderit voluptate. Consequat quis
            pariatur ullamco eiusmod reprehenderit mollit non in in amet. Cillum veniam laborum
            ipsum incididunt ad non consectetur tempor ea tempor. Quis ipsum in non dolore occaecat
            sit.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
