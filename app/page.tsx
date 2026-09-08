import Link from "next/link";

const quizzes = [
  ["attachment-compass","Attachment Compass","Notice how you seek closeness, reassurance, and space."],
  ["conflict-rhythm","Conflict Rhythm","Explore what happens when tension enters a relationship."],
  ["love-language","Connection Signals","Reflect on the ways care feels most meaningful to you."]
];

export default function Home(){return <main>
  <nav className="nav wrap"><Link href="/" className="brand">LOVE PATTERN LAB</Link><span>Relationship & personality self-reflection</span></</nav>
  <section className="hero wrap"><p className="kicker">SELF-REFLECTION FOR REAL RELATIONSHIPS</p><h1>Understanding yourself<br/><em>changes how you connect.</em></h1><p className="lead">Short, thoughtful quizzes to notice your relationship patterns, put words to your needs, and begin more honest conversations.</p><div className="badges"><span className="badge">✓ Free basic result</span><span className="badge">✓ Optional full report · US$2.99</span></div</div></section>
  <section className="dark"><div className="wrap"><p className="kicker">EXPLORE THE QUIZZES</p><div className="grid">{quizzes.map(([slug,title,copy],i)=><article className="card" key={slug}><p className="kicker">0{i+1}</p><h2>{title}</h2><p>{copy}</p><Link href={`/quiz/${slug}`}>Take the quiz →</Link></article>)}</div><p style={{textAlign:'center',color:'#aab3b0',marginTop:32,fontSize:12}}>For education, entertainment, and self-reflection only. Not a medical or psychological diagnosis.</p><footer className="footer"><span>© 2026 Love Pattern Lab</span><nav><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms">Terms</Link><Link href="/refund-policy">Refund Policy</Link><Link href="/disclaimer">Disclaimer</Link><Link href="/contact">Contact</Link></nav></footer></div></section>
</main>}
