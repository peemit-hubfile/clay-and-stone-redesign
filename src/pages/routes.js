// Route table: one entry per page; each renders in every language.
import { renderHome } from './home.js';
import { renderStub } from './stub.js';

const L = (th, en) => ({ th, en });

export function buildRoutes(content) {
  const routes = [{ path: '', render: renderHome }];
  const stub = (path, title, lead = null, extra = {}) => routes.push({ path, title, lead, render: renderStub, ...extra });

  stub('homes', L('แบบบ้านทั้งหมด', 'Our Homes'), L('2 ซีรีส์ 5 แบบบ้าน ตั้งแต่บ้านพักผ่อนขนาดกะทัดรัดไปจนถึงบ้านสำหรับครอบครัว', 'Two series and five homes, from compact retreats to family houses.'));
  for (const s of content.series.filter((x) => x.status === 'available')) {
    stub(`homes/${s.slug}`, s.name, s.tagline);
  }
  for (const m of content.models) {
    const s = content.series.find((x) => x.id === m.series_id);
    stub(m.path.replace(/^\//, ''), L(`${s.name.th} ${m.name.th}`, `${s.name.en} ${m.name.en}`), null, { model: m });
  }
  stub('compare', L('เปรียบเทียบแบบบ้าน', 'Compare Homes'));
  stub('home-finder', L('ค้นหาบ้านที่ใช่', 'Home Finder'), content.finder.intro.lead);
  stub('projects', L('โปรเจค', 'Projects'), L('ผลงานบ้าน Clay & Stone ที่ส่งมอบแล้ว', 'Completed Clay & Stone homes.'));
  stub('how-we-build', L('กระบวนการ', 'How We Build'), L('จากแบบบ้าน สู่บ้านที่พร้อมอยู่ ใน 4 ขั้นตอน', 'From plan to move-in in four steps.'));
  stub('knowledge', L('สิ่งที่ควรรู้', 'Good to Know'), L('คำถามที่พบบ่อย วิดีโอ และบทความเรื่องบ้านโมดูลาร์', 'FAQs, videos and articles about modular homes.'));
  stub('about', L('เกี่ยวกับเรา', 'About Clay & Stone'));
  stub('contact', L('ติดต่อเรา', 'Contact'), L('คุยกับทีมงานผ่าน LINE โทรศัพท์ หรืออีเมล หรือนัดชมโชว์รูมที่นนทบุรี', 'Reach us on LINE, by phone or email, or book a showroom visit in Nonthaburi.'));
  return routes;
}
