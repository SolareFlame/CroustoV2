import {checkMenu} from "./menu/checkMenu";

function startChecking() {
    const now = new Date();
    const nextHour = new Date(now);

    nextHour.setHours(now.getHours() + 1, 0, 0, 0);
    const timeUntilNextHour = nextHour - now;

    console.log(`Prochaine exécution à : ${nextHour.toLocaleTimeString()}, dans ${timeUntilNextHour / 1000} secondes`);

    //attendre jusqu'a la prochaine heure puis setInterval d'une heure
    setTimeout(() => {
        setInterval(() => {

            let h = new Date().getHours();
            console.log(`Heure data : ${h}`);

            let menus = checkMenu(h);
            console.log(menus);

        }, 3600000);

    }, timeUntilNextHour);

}


