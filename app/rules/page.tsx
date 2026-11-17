

export default function rules() {
 
    return (
        <div>
            <div className="rules">
                <div className="title">
                    <h1>Règles du jeu</h1>
                    <h2>Final Fantasy VII - the levels game</h2>
                </div>

                <section className="rule-general">
                    <h2>Présentation générale</h2>
                    <p>
                        Le jeu est composé de quatre niveaux à franchir dans l'ordre.
                        Chaque niveau propose une épreuve différente inspirée de l'univers
                        de Final Fantasy VII. Vous devez réussir un niveau pour débloquer le suivant.
                    </p>
                    <p>
                        Pour pouvoir jouer, vous devez être <strong>inscrit</strong> et <strong>connecté</strong>.
                        Sans compte, les niveaux sont visibles mais inaccessibles.
                    </p>
                </section>

                <section className="rule-niveau1">
                    <h2>Niveau 1 — Le Quizz</h2>
                    <p>
                        Une série de <strong>5 questions</strong> vous est posée. Pour chaque question,
                        vous choisissez l'un des trois modes de jeu suivants :
                    </p>
                    <ul>
                        <li>
                            <strong>Carré 400points</strong> : quatre propositions sont affichées,
                            une seule est correcte.
                        </li>
                        <li>
                            <strong>Duo 200points</strong> : deux propositions seulement, à vous de
                            trouver la bonne (50 / 50).
                        </li>
                        <li>
                            <strong>Caché 600points</strong> : aucune proposition, vous devez taper
                            la réponse vous-même puis valider avec la touche Entrée. <br />
                            Un<strong> seul mot </strong> est attendu ; le singulier ou le pluriel
                            sera précisé à la fin de la question entre parenthèses.
                        </li>
                    </ul>
                    <p>
                        Chaque mode rapporte un nombre de points différent selon la difficulté.
                        À l'issue des 5 questions, il faut totaliser au minimum
                        <strong> 1200 points sur 3000 (maximum gagnable) </strong> pour passer au niveau 2.
                        En dessous, la partie est perdue et le quizz recommence avec de
                        nouvelles questions.
                    </p>
                </section>

                <section className="rule-niveau2">
                    <h2>Niveau 2 — La course de Chocobos</h2>
                    <p>
                        Vous démarrez avec <strong>1000 gils</strong>. Huit chocobos sont
                        au départ : vous répartissez vos mises sur les chocobos de votre choix
                        avant de lancer la course.
                    </p>
                    <ul>
                        <li>Une mise doit être un nombre entier positif.</li>
                        <li>
                            À l'arrivée, le gain dépend de la position du chocobo sur lequel vous avez parié,
                            selon les multiplicateurs suivants appliqués à la mise :
                            <table className="multiplicateurs">
                                <thead>
                                    <tr>
                                        <th>Position</th>
                                        <th>1<sup>er</sup></th>
                                        <th>2<sup>e</sup></th>
                                        <th>3<sup>e</sup></th>
                                        <th>4<sup>e</sup></th>
                                        <th>5<sup>e</sup></th>
                                        <th>6<sup>e</sup></th>
                                        <th>7<sup>e</sup></th>
                                        <th>8<sup>e</sup></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Multiplicateur</td>
                                        <td>x2.5</td>
                                        <td>x1.75</td>
                                        <td>x1.25</td>
                                        <td>x1</td>
                                        <td>x0.75</td>
                                        <td>x0.5</td>
                                        <td>x0.25</td>
                                        <td>x0</td>
                                    </tr>
                                </tbody>
                            </table>
                            Exemple : une mise de 100 gils sur le chocobo qui finit 1<sup>er</sup> rapporte 250 gils ;
                            la même mise sur le chocobo qui finit 8<sup>e</sup> est entièrement perdue.
                        </li>
                        <li>
                            Votre solde est mis à jour : ancien solde - total des mises + total des gains.
                        </li>
                    </ul>
                    <p>
                        L'objectif est d'atteindre un solde d'au moins <strong>2000 gils</strong>
                        pour valider le niveau et passer au suivant. Entre <strong>300 et 1999 gils</strong>,
                        vous devez continuer à parier. En dessous de <strong>300 gils</strong>, la partie
                        est perdue : votre solde est automatiquement <strong>réinitialisé à 1000 gils </strong> 
                        pour recommencer. Vérifiez régulièrement votre solde avec le bouton prévu à cet effet.
                    </p>
                </section>

                <section className="rule-niveau3">
                    <h2>Niveau 3 — Le lancer de dés</h2>
                    <p>
                        Un duel de dés en <strong>3 manches</strong> contre un adversaire.
                        À chaque manche, vous disposez de <strong>3 dés à 6 faces</strong> et de
                        <strong> 3 lancers maximum </strong> pour réaliser la meilleure main possible.
                    </p>
                    <ul>
                        <li>Au premier lancer, les trois dés sont tirés au sort.</li>
                        <li>
                            Après chaque lancer, vous pouvez <strong>verrouiller</strong> les dés
                            que vous souhaitez conserver. Un dé verrouillé ne sera plus relancé.
                        </li>
                        <li>
                            Les dés non verrouillés sont relancés à chaque relance, jusqu'à
                            ce que vous ayez utilisé vos 3 lancers ou verrouillé les 3 dés.
                        </li>
                        <li>
                            Une fois les 3 lancers effectués ou les 3 dés verrouillés, vous
                            vérifiez votre main : l'adversaire lance alors ses dés et le gagnant
                            de la manche est désigné.
                        </li>
                    </ul>
                    <p>
                        Certaines mains forment des <strong>combinaisons spéciales</strong>
                        (brelans, suites…) qui priment sur les mains ordinaires. Attention à la
                        <strong> « nénette » (4-2-1) </strong> : c'est la pire main possible.
                        À défaut de combinaison, c'est la valeur des dés qui départage.
                    </p>
                    <ul>
                        <li>Manche gagnée : <strong>+500 points</strong>.</li>
                        <li>Égalité : <strong>+250 points</strong>.</li>
                        <li>Manche perdue : <strong>0 point</strong>.</li>
                    </ul>
                    <p>
                        À l'issue des 3 manches, il faut totaliser au minimum
                        <strong> 1000 points </strong> pour battre l'adversaire et passer au
                        niveau 4. En dessous, la partie est perdue et le niveau recommence.
                    </p>
                </section>

                <section className="rule-niveau4">
                    <h2>Niveau 4 — Le 2048</h2>
                    <p>
                        Disponible uniquement après avoir terminé le niveau 3. Sur une grille
                        <strong> 4×4 </strong>, fusionnez les tuiles de même valeur (2 + 2 = 4,
                        16 + 16 = 32, etc.). À chaque mouvement, une nouvelle tuile (2 ou 4)
                        apparaît.
                    </p>
                    <ul>
                        <li>Déplacez les tuiles avec les <strong>flèches du clavier</strong>, ou
                            <strong> ZQSD </strong> / <strong> WASD </strong>.</li>
                        <li><strong>+5 points</strong> par mouvement valide (qui déplace au moins une tuile).</li>
                        <li><strong>+20 points</strong> par fusion de tuiles.</li>
                        <li><strong>+2500 points bonus</strong> si vous atteignez la tuile 2048.</li>
                    </ul>
                    <p>
                        Le niveau est validé de deux façons : en atteignant un score de partie d'au
                        moins <strong>2500 points</strong>, ou en réalisant la tuile
                        <strong> 2048</strong>. Cliquez sur <strong>« Finir et enregistrer »</strong>
                        pour valider votre score. Si plus aucun mouvement n'est possible avant
                        d'avoir atteint l'objectif, la partie est perdue et vous recommencez.
                    </p>
                </section>

                <section className="rule-leaderboard">
                    <h2>Leaderboard</h2>
                    <p>
                        Vos résultats sont enregistrés dans le classement public. Plus vous
                        progressez dans les niveaux et plus votre score est élevé, plus
                        votre place dans le leaderboard est haute. Seuls les
                        <strong> 5 meilleurs joueurs </strong> sont affichés.
                    </p>
                </section>
            </div>
        </div>
    );
};

