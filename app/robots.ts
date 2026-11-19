import type {MetadataRoute} from 'next';
export default function robots():MetadataRoute.Robots{return{rules:{userAgent:'*',allow:'/',disallow:['/admin','/malik','/operator','/computerji','/judge','/api/','/documents/','/guest-payment/','/performer-payment/','/performer-details/','/ticket/','/tickets/confirmation/','/verifyticket','/scanner/']},sitemap:'https://www.gkpgotlatent.in/sitemap.xml'};}
