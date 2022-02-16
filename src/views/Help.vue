<template>
  <div class="container">
    <div class="text-center mt-5">
      <h1>Aide à propos de la carte</h1>
      <p class="lead">Pour une meilleure compréhension de la carte et de ses fonctionnalités</p>
      <p class="body-help">
        À l'heure actuelle, il existe plus de 23'000 points d'intérets (appelés ci-après POI) dans les 5 cantons de la Suisse romande que sont Vaud, Genève, Fribourg, Neuchâtel et Valais.
        Pour des questions de fluidité face à ce grand nombre de POI, ceux-ci sont regroupés géographiquement par des cercles de différentes couleurs (de vert à rouge selon leur densité).
        Pour voir individuellement ces POI, il suffit d'agrandir la carte.</p>
      <h2 class="body-help">Légende de la carte</h2>
      <ul class="body-help">
        <li><img src="../../public/images/map_marker_stop.png" alt="Icône pokéstop"> : Représente un pokéstop</li>
        <li><img src="../../public/images/map_marker_default_01.png" alt="Icône arène"> : Représente une arène</li>
        <li><img src="../../public/images/map_marker_default_ex_03.png" alt="Icône arène EX"> : Représente une arène EX</li>
      </ul>
      <p class="body-help">Il existe plusieurs boutons à disposition :
        <ul class="body-help">
          <li>Bouton <b>"Loupe"</b> : Permet de rechercher un POI par son nom</li>
          <li>Bouton <b>"Pokéstop" bleu clair</b> : Permet d'afficher ou non les pokéstops</li>
          <li>Bouton <b>"Arène" bleu foncé</b> : Permet d'afficher ou non des arènes</li>
          <li>Bouton <b>"Arène EX" gris</b> : Permet d'afficher ou non des arènes EX</li>
          <li>Bouton <b>"Grille"</b> : Permet d'afficher ou non la grille représentant les cellules S2 (voir les explications en-dessous). Le nombre dans les cases rouges indique le nombre de pokéstops restant avant l'apparition d'une nouvelle arène</li>
        </ul>
      </p>
      <h2 class="body-help">Explications des cellules "S2"</h2>
      <p class="body-help">La carte du monde peut être découpée sous forme de quadrilatères (généralement des parallélogrammes) que l'on appelle des cellules.<br></p>
      <img class="responsive" src="../../public/images/Example_cells_14.jpg" alt="Cells example" width=75% ><br>
      <i>Ci-dessus un exemple des cellules S14 . Afin de visualiser ces niveaux de cellules, le site de <a href="https://s2.sidewalklabs.com/regioncoverer/">sidewalklabs</a> peut vous être utile.</i><br><br>
      <p class="body-help">
      Ce sont les cellules "S2" qui déterminent l'apparition ou non d'un POI dans le jeu "<i>Pokémon GO</i>". Dans ce jeu, deux niveaux de cellules sont importantes : <br><br>
      <b>Cellules S14 (ou niveau 14)</b><br>
      Les cellules S14, représentées par des quadrilatères rouges sur la carte, permettent de déterminer le nombre d'arènes en fonction du nombre de POI dans ces cellules. Cela suit le schéma suivant :
      <ul class="body-help">
          <li>Au bout de <b>2 POI</b>, une arène apparaît</li>
          <li>Au bout de <b>6 POI</b>, une 2e arène apparaît</li>
          <li>Au bout de <b>20 POI</b>, une 3e arène apparaît</li>
      </ul>
      </p>
      <p class="body-help"><i>Il existe néanmoins des exceptions où l'on peut retrouver plus de trois arènes dans une cellule S14.</i><br><br>
      <b>Cellules S17 (ou niveau 17)</b><br>
      Les cellules S17, représentées par des quadrilatères verts sur la carte, permettent de déterminer le nombre de POI. Généralement, il n'existe qu'un pokéstop, ou arène, ou arène EX dans ces cellules mais il arrive d'en trouver plusieurs dans une même cellule S17.
      </p>
      <br>
      <h2 class="body-help">FAQ</h2>
      <p class="body-help"><b>À quelle fréquence la carte sera-t-elle mise à jour ?</b><br>
      Environ tous les mois</p>
      <br>
    </div>
  </div>
</template>
