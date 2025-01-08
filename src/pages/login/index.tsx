import { IconMap } from "../../assets/iconMap";
import { theme } from "../../assets/theme";
import Typography from "../../components/typography";

/**
 * TODO: Change the input into single componets
 * check the rest of the pages to make logic right
 * add TW
 * chage to CSS file
 * download and chage the image
 */
const Login = () => {
    return <section style={{ display: 'flex', flex: 1, }}>
        <article style={{ display: 'flex', flex: 2, height: '100vh', position: 'relative' }}>
            <img
                src={"https://s3-alpha-sig.figma.com/img/da13/45c1/3da60dd48a5b6aab7298c7e487c814f3?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=D-BYhChS5HdGdFpiQxrjj-t7VOT-3scycC0zs1FQNGLSX6tN26i7LSPr4156b5j58SHr5Tpv0dbD~S5MxX4QwDe9QdOFghfz~uIzwebPFJuNaBgqqrCkQgnxptih9kAi8Pd9PToC8byhnyLse5XIAqPULMzbWt1J6OjnMkpLO7rwFUT~75I6sbxPLA-eipsFwa5moSuEOE7bmlMH9SPhoE-ysYBN7e-yS5eq2PrHayE6XAJ86-zwA06x6yLuSIijwH8AdLHtEKpN6FKoaswXCwAFz1ls0q0EU0Kx4ug-3KQF-Y9ACWFwhAIO3HwfVIsVgPdokHrLEcmXHJ8Ms0LG0w__"}
                style={{
                    objectFit: 'cover',
                    objectPosition: 'center left',
                    width: '100%',
                    height: '100%'
                }}
            />
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#3E3F7266', // Filtro con el color deseado y opacidad
                zIndex: 1, // Asegura que el overlay esté encima de la imagen
            }} />
        </article>
        <section style={{ display: 'flex', flex: 1, flexDirection: 'column', paddingLeft: '9%', paddingRight: '10%', backgroundColor: 'white' }}>
            <Typography type='s2' styles={{ color: theme.palette.primary_500 }}>Iniciar sesión</Typography>
            <div style={{ width: '100px', border: `6px solid ${theme.palette.secondary_500}`, marginTop: '-45px' }} />
            <Typography type='m9' styles={{ color: theme.palette.darkLetter_500 }}>Para ingresar al sistema de gestión de porcinos debes ingresar tu usuario y contraseña.</Typography>
            <img src={IconMap.MainIcon} style={{ width: '151px', height: '184.65px', alignSelf: 'center', marginTop: '80px', marginBottom: '18px' }} />
            <input placeholder="Usuario" />
            <input placeholder="Contraseña" />
            <section style={{ display: 'flex', alignSelf: 'center' }}>
                <input type="checkbox" style={{ marginRight: '12px' }} />
                <Typography type='p9' styles={{ color: theme.palette.darkLetter_500 }}>Recordar usuario y contraseña</Typography>
            </section>
            <button style={{ backgroundColor: theme.palette.primary_500, color: 'white', marginTop: '21px' }}>Iniciar sesión</button>
            <button style={{ backgroundColor: 'white', border: `1px solid ${theme.palette.secondary_500}`, color: theme.palette.secondary_500, marginTop: '16px' }}>Registrarme</button>
        </section>
    </section>
}
export default Login;