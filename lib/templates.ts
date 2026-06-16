export interface Template {
  id: string;
  industry: string;
  title: string;
  text: string;
}

const TEMPLATES: Template[] = [
  // ── Technology ──
  {
    id: "t1",
    industry: "Technology",
    title: "Shipping lessons",
    text: "We shipped [feature] last week.\n\nHere's what nobody tells you about going from prototype to production:\n\n1/ The last 10% takes 50% of the time.\n\n2/ Your first users will break things you didn't even know could break.\n\n3/ Documentation you skip now becomes a 3am Slack later.\n\n4/ Launch is not the finish line — it's the starting gun.\n\nThe best teams ship fast and iterate faster.\n\nWhat's the hardest lesson you learned shipping something?",
  },
  {
    id: "t2",
    industry: "Technology",
    title: "AI is a tool, not a threat",
    text: "AI won't replace you.\n\nA person using AI will.\n\nHere's the workflow my team adopted this quarter:\n\n• Drafting: 80% faster with AI-first writing\n• Research: Instant summarization of 50 sources\n• Code review: Automated pattern detection\n• Strategy: AI-generated scenario modeling\n\nThe ROI isn't replacement — it's amplification.\n\nWhat's one task you've successfully delegated to AI?",
  },
  {
    id: "t3",
    industry: "Technology",
    title: "Tech stack honesty",
    text: "We chose [tech] for our stack.\n\nHere's the honest truth 6 months in:\n\nWhat went well:\n• Developer velocity improved 2x\n• Documentation was solid\n• Community support was active\n\nWhat we struggled with:\n• Cold starts were brutal\n• Vendor lock-in is real\n• Cost scaled faster than we expected\n\nWould we make the same choice again? Mostly yes — but with a few caveats.\n\nWhat tech decision are you rethinking?",
  },
  {
    id: "t4",
    industry: "Technology",
    title: "Technical debt spiral",
    text: "Technical debt is like compound interest.\n\nExcept in reverse.\n\nA shortcut today means:\n• 2x the time to add features next month\n• 3x the onboarding time for new devs\n• 5x the production incidents in 6 months\n\nThe worst part? It's invisible until it's an emergency.\n\nWe just spent 6 weeks paying down debt. Here's what we should have done instead:\n\n1/ Never merge without tests\n2/ Refactor as you go (scout rule)\n3/ Budget 20% of each sprint for cleanup\n4/ Document decisions, not just code\n\nHow much tech debt is your team carrying?",
  },
  {
    id: "t5",
    industry: "Technology",
    title: "The pivot moment",
    text: "We spent 8 months building something nobody wanted.\n\nHere's how we figured it out:\n\nThe leading indicators we missed:\n• Users signed up but didn't come back\n• Support tickets were always about onboarding, not features\n• Revenue was flat despite more traffic\n\nWhat saved us:\n• Customer interviews (not surveys)\n• A single metric: weekly active usage\n• Willingness to kill our darlings\n\nPivoting felt like failure at first.\n\nLooking back, it was the smartest decision we made.\n\nWhat's a tough product decision you're facing?",
  },
  {
    id: "t6",
    industry: "Technology",
    title: "Scaling engineering culture",
    text: "We grew from 5 to 50 engineers in 18 months.\n\nHere's what broke along the way:\n\n1/ Code review bottlenecks\n   — Solution: async reviews with SLAs\n\n2/ Knowledge silos\n   — Solution: rotating pairing sessions\n\n3/ Inconsistent standards\n   — Solution: living style guide owned by the team\n\n4/ Decision paralysis\n   — Solution: written RFCs for anything non-trivial\n\nThe culture that works for 5 people breaks at 15 and implodes at 30.\n\nHow are you scaling your engineering team?",
  },
  {
    id: "t7",
    industry: "Technology",
    title: "Junior dev advice",
    text: "The best advice I'd give my junior dev self:\n\n1/ Read more code than you write.\n   Great programmers are great readers of code.\n\n2/ Ask \"why\" three times before implementing.\n   Requirements are rarely what they seem.\n\n3/ Learn to debug systematically.\n   Binary search your assumptions.\n\n4/ Write for the reader, not the compiler.\n   Code is read far more often than it's written.\n\n5/ Say \"I don't know\" early and often.\n   It builds trust and accelerates learning.\n\nWhat advice would you add?",
  },
  {
    id: "t8",
    industry: "Technology",
    title: "Open source payoff",
    text: "We open-sourced a tool last year.\n\nExpected outcome: Good karma.\n\nActual outcome:\n• 12k GitHub stars\n• 47 contributors\n• 3 production bugs found and fixed by the community\n• 2 enterprise customers who found us through the repo\n• Countless recruiter reach-outs to our team\n\nOpen source is the best marketing you can't buy.\n\nWhat's stopping you from open-sourcing more?",
  },

  // ── Marketing ──
  {
    id: "t9",
    industry: "Marketing",
    title: "Brand ≠ logo",
    text: "Your brand is not your logo.\n\nIt's the feeling people get when they hear your name.\n\n7 ways to engineer that feeling:\n\n1/ Consistency over perfection\n2/ Voice that sounds like a person, not a corporation\n3/ Values demonstrated, not stated\n4/ Experience that exceeds the promise\n5/ Community that connects users to each other\n6/ Storytelling that makes the abstract tangible\n7/ Generosity without a transaction attached\n\nBrands that win are the ones people genuinely root for.\n\nDoes your brand pass the \"would I miss it if it disappeared\" test?",
  },
  {
    id: "t10",
    industry: "Marketing",
    title: "Content that converts",
    text: "Stop creating content. Start creating conversions.\n\nHere's the framework:\n\nTop of funnel (80% of content):\n  — Entertain, educate, inspire. No pitch.\n\nMiddle of funnel (15% of content):\n  — Case studies, comparisons, deep dives.\n\nBottom of funnel (5% of content):\n  — Direct offers, trials, demos.\n\nMost brands get this backwards.\nThey lead with offers and wonder why nobody's buying.\n\nBuild trust first. Sell second.\n\nWhat's your content-to-revenue ratio looking like?",
  },
  {
    id: "t11",
    industry: "Marketing",
    title: "The hook formula",
    text: "I analyzed 500 viral LinkedIn posts.\n\nThe hook is everything.\n\nHere are the 7 hook templates that consistently win:\n\n1/ The contrarian: \"Everyone says X. But the data says Y.\"\n\n2/ The secret: \"Nobody tells you this about [topic].\"\n\n3/ The number: \"5 things I learned about [topic].\"\n\n4/ The story setup: \"I did [action] for [time]. Here's what happened.\"\n\n5/ The bold claim: \"[Topic] is not what you think.\"\n\n6/ The question: \"Why do most [people/companies] fail at [thing]?\"\n\n7/ The prediction: \"[Year] will be the year of [trend].\"\n\nSave this. Use it for your next post.\n\nWhich hook will you try?",
  },
  {
    id: "t12",
    industry: "Marketing",
    title: "Growth without ads",
    text: "We grew from 0 to 50k users with $0 ad spend.\n\nHere's exactly how:\n\n1/ Ship something remarkable enough that people share it.\n   (If nobody's sharing, it's not remarkable enough.)\n\n2/ Turn every user into a channel.\n   Build sharing into the product experience.\n\n3/ Community over campaigns.\n   One passionate community > ten ad campaigns.\n\n4/ Content that compounds.\n   Write once, rank forever.\n\n5/ Partnerships with aligned products.\n   Cross-promotion is the cheapest distribution.\n\nPaid acquisition is a tax on bad product-market fit.\n\nWhat's your most effective zero-cost growth channel?",
  },
  {
    id: "t13",
    industry: "Marketing",
    title: "Storytelling framework",
    text: "The 4-part storytelling framework that made our content 3x more engaging:\n\n1/ The Before\n  \"Two years ago, our content was getting 200 impressions.\"\n\n2/ The Catalyst\n  \"Then we discovered one thing: nobody cares about our product. They care about their problems.\"\n\n3/ The Journey\n  \"We shifted from 'here's what we built' to 'here's how we solved [problem].' We started every post with the struggle, not the solution.\"\n\n4/ The After\n  \"Today we average 50k impressions. Not because we're smarter — because we finally understood what storytelling actually means.\"\n\nEvery great post follows this arc.\n\nWhat story are you telling?",
  },
  {
    id: "t14",
    industry: "Marketing",
    title: "Personal branding ROI",
    text: "I invested 2 hours a week into LinkedIn for 6 months.\n\nHere's the exact ROI:\n\n• 12k followers\n• 47 new business inquiries\n• 5 speaking gigs\n• 3 podcast invitations\n• 1 book deal offer\n• 0 dollars spent\n\nPersonal branding is the highest-LOI (return on luck) investment you can make.\n\nThe math is simple:\n  — 2 hours/week = 8 hours/month = 96 hours total\n  — 47 inquiries = ~2 hours per qualified lead\n\nWhat's your time worth vs what you'd pay for leads?\n\nStart posting today.\n\nYour future self will thank you.",
  },
  {
    id: "t15",
    industry: "Marketing",
    title: "Audience building",
    text: "Building an audience is not about content.\n\nIt's about consistency × relevance × time.\n\nMost people quit after 30 days.\n\nHere's the reality check:\n\nMonth 1–3: You'll talk to an empty room. Keep going.\nMonth 4–6: A few people will start engaging. Double down.\nMonth 7–12: You'll have a real community. Nurture it.\nYear 2+: Compounding effects kick in. Enjoy the ride.\n\nThe algorithm doesn't reward quality in a week.\n\nIt rewards consistency over years.\n\nStop looking for hacks.\n\nStart building the habit.\n\nHow long have you been consistently creating?",
  },
  {
    id: "t16",
    industry: "Marketing",
    title: "Marketing measurement",
    text: "Most marketers measure the wrong things.\n\nVanity metrics sell reports but don't drive decisions.\n\nMeasure what matters:\n\n✔ Customer acquisition cost (CAC)\n✔ Lifetime value (LTV)\n✔ LTV:CAC ratio (>3:1 is healthy)\n✔ Time to payback CAC\n✔ Net revenue retention\n✔ Qualitative feedback themes\n\nStop tracking:\n✖ Page views (unless monetized)\n✖ Social followers (unless engaged)\n✖ Email list size (unless opening)\n✖ Brand mentions (unless sentiment-tracked)\n\nWhat metric are you optimizing this quarter?",
  },

  // ── Sales ──
  {
    id: "t17",
    industry: "Sales",
    title: "Closing without pressure",
    text: "I closed $1.2M last quarter without a single cold call.\n\nHere's the framework:\n\n1/ Research like a journalist\n  — Know their business before they say hello\n\n2/ Value in the first interaction\n  — Share an insight, don't pitch a product\n\n3/ Listen for pain, not budget\n  — Budget follows urgency\n\n4/ Create FOMO naturally\n  — \"We're helping [competitor] solve this right now\"\n\n5/ Make the decision easy\n  — Too many options = no decision\n\nPeople don't buy because you're good at selling.\n\nThey buy because they trust you understand their problem.\n\nWhat's your most effective closing technique?",
  },
  {
    id: "t18",
    industry: "Sales",
    title: "Objection handling",
    text: "\"We don't have the budget.\"\n\nThe most common objection — and how to handle it:\n\nWrong response: \"Let me show you our pricing tiers.\"\n\nRight response: \"I hear you. What would having this solution be worth to your team?\"\n\nIf there's genuine value, budget finds a way.\n\nOther common objections and responses:\n\n\"We're already using [competitor].\"\n  → \"What do you wish they did better?\"\n\n\"Not the right time.\"\n  → \"What would make it the right time?\"\n\n\"Send me some info.\"\n  → \"I'd love to. Can we schedule 10 minutes to go through it?\"\n\nObjections are not rejections. They're requests for more information.\n\nWhat objection do you hear most often?",
  },
  {
    id: "t19",
    industry: "Sales",
    title: "Follow-up sequence",
    text: "70% of sales happen after the 5th follow-up.\n\nMost salespeople give up after 2.\n\nHere's my follow-up sequence:\n\nDay 1: Value-add email (article + insight)\nDay 4: Specific use case relevant to them\nDay 8: Social proof (case study)\nDay 14: Quick question (engagement)\nDay 21: Breakup email\nDay 30: Final value nugget\n\nEach touchpoint should give value, not ask for something.\n\nBy touchpoint 5, you've built enough trust for a conversation.\n\nFollow-up is not nagging. It's proving you care.\n\nHow many touchpoints before you give up?",
  },
  {
    id: "t20",
    industry: "Sales",
    title: "Discovery questions",
    text: "The quality of your discovery determines the quality of your close.\n\n5 questions that changed my sales career:\n\n1/ \"What's changed in your business that made you look for solutions now?\"\n  → Reveals urgency drivers\n\n2/ \"What have you tried before, and why didn't it work?\"\n  → Avoids past mistakes\n\n3/ \"If nothing changes, what happens in 6 months?\"\n  → Quantifies cost of inaction\n\n4/ \"Who else needs to be part of this decision?\"\n  → Identifies stakeholders early\n\n5/ \"What would 'perfect' look like for you?\"\n  → Sets clear success criteria\n\nPeople buy based on their criteria, not your pitch.\n\nWhat's the one question you always ask?",
  },
  {
    id: "t21",
    industry: "Sales",
    title: "Social selling",
    text: "I generated 40% of my pipeline from LinkedIn last quarter.\n\nHere's the exact social selling system:\n\nProfile optimization (done once):\n  — Headline that targets your ICP\n  — Featured section with case studies\n  — About section that's client-centric\n\nDaily actions (30 min):\n  — Engage with 10 target accounts' posts\n  — Send 5 personalized connection requests\n  — Write 1 post that demonstrates expertise\n\nWeekly actions (1 hour):\n  — Share 1 client win (anonymized)\n  — Comment on 3 industry trends\n  — DM follow-ups to new connections\n\nSocial selling works because it's warm outreach disguised as value.\n\nWhat's your LinkedIn prospecting strategy?",
  },
  {
    id: "t22",
    industry: "Sales",
    title: "Cold outreach that works",
    text: "Cold outreach has a 1% response rate.\n\nUnless you do this:\n\nPersonalization > templates\n  — Mention something specific about their work\n\nBrevity > completeness\n  — 4 sentences max. Anything else is a draft.\n\nValue > ask\n  — Give a relevant insight before requesting a call\n\nSpecificity > generality\n  — \"I saw your post about [topic]\" vs \"I liked your profile\"\n\nThe goal of cold outreach is not a sale.\n\nIt's a conversation.\n\nWhat's your best cold outreach tip?",
  },

  // ── Design ──
  {
    id: "t23",
    industry: "Design",
    title: "Design criticism culture",
    text: "The best design teams critique ruthlessly.\n\nBut they critique the work, not the person.\n\nHere's how to give feedback that actually helps:\n\nInstead of \"I don't like this.\"\n  → \"What problem is this solving?\"\n\nInstead of \"Make it pop.\"\n  → \"The hierarchy could be clearer — what's the primary action?\"\n\nInstead of \"This feels off.\"\n  → \"The spacing here is inconsistent with our system.\"\n\nSpecific feedback is actionable feedback.\n\nVague feedback is just noise.\n\nHow does your team handle design critiques?",
  },
  {
    id: "t24",
    industry: "Design",
    title: "Design systems payoff",
    text: "We invested 3 months in a design system.\n\nHere's the ROI after 1 year:\n\nBefore:\n  — 4 weeks to ship a new page\n  — Inconsistent UI across products\n  — 200+ unique button components\n\nAfter:\n  — 5 days to ship a new page\n  — Single source of truth\n  — 12 reusable components\n  — 60% fewer QA bugs\n  — Designers focus on problems, not pixels\n\nThe upfront investment hurts.\n\nBut the compounding returns are massive.\n\nHave you made the case for a design system yet?",
  },
  {
    id: "t25",
    industry: "Design",
    title: "UX principles",
    text: "The 10 UX principles every designer should know:\n\n1/ Visibility — Don't hide important information\n\n2/ Feedback — Every action needs a reaction\n\n3/ Affordance — Make clickable things look clickable\n\n4/ Consistency — Same patterns, same outcomes\n\n5/ Error prevention — Better than error messages\n\n6/ Recognition — Easier than recall\n\n7/ Flexibility — Accommodate different user skill levels\n\n8/ Minimalist design — Less is more\n\n9/ Error recovery — Make undo easy\n\n10/ Help — Contextual, not generic\n\nWhich principle do you see violated most often?",
  },
  {
    id: "t26",
    industry: "Design",
    title: "Typography matters",
    text: "Good typography is invisible.\n\nBad typography is all you see.\n\nHere's a quick typography checklist:\n\n✔ Line length: 45–75 characters\n✔ Line height: 1.5× for body text\n✔ Font size hierarchy: 4+ distinct levels\n✔ Contrast: WCAG AA minimum (4.5:1)\n✔ Alignment: Left-aligned for long text\n✔ Orphans: Eliminate single words on last line\n\nTypography is 90% of the design.\n\nThe rest is decoration.\n\nWhen did you last audit your product's typography?",
  },

  // ── Finance ──
  {
    id: "t27",
    industry: "Finance",
    title: "Financial independence",
    text: "The fastest path to financial independence:\n\n1/ Earn more (obvious, but most underinvest here)\n2/ Spend less than you earn (yes, still true)\n3/ Invest the difference consistently\n4/ Let compounding do the heavy lifting\n\nHere's the math:\n  $500/month invested at 8% for 30 years = $745,000\n  $1,000/month = $1.49M\n  $2,000/month = $2.98M\n\nThe habits matter more than the amounts.\n\nStart early. Stay consistent.\n\nWhat's your #1 money tip?",
  },
  {
    id: "t28",
    industry: "Finance",
    title: "Startup budgeting",
    text: "The 3 financial mistakes that kill startups:\n\n1/ Hiring too fast\n  — Headcount is the biggest expense\n  — Each hire should directly drive revenue\n\n2/ Ignoring unit economics\n  — If CAC > LTV, you have a business problem\n  — Know your numbers before you scale\n\n3/ Running out of runway\n  — Raise before you need it\n  — Plan for 18 months of runway\n  — Cut burn at the first sign of trouble\n\nCash is oxygen.\n\nRun out and your startup dies in minutes.\n\nWhat's your burn rate looking like?",
  },
  {
    id: "t29",
    industry: "Finance",
    title: "Investment mindset",
    text: "The stock market is a device for transferring money from the impatient to the patient.\n\n— Warren Buffett\n\n3 lessons I wish I'd learned earlier:\n\n1/ Time in the market beats timing the market\n  — Missing the 10 best days cuts returns in half\n\n2/ Diversification is protection against ignorance\n  — But over-diversification dilutes returns\n\n3/ Low fees compound\n  — A 1% fee difference costs 30% of your returns over 30 years\n\nInvesting is simple.\n\nKeeping it simple is hard.\n\nWhat's your investment philosophy?",
  },
  {
    id: "t30",
    industry: "Finance",
    title: "negotiation tactics",
    text: "5 negotiation principles that saved me $500k+:\n\n1/ Know your BATNA\n  — Best Alternative To Negotiated Agreement\n  — The stronger your alternative, the stronger your position\n\n2/ Let them name the first number\n  — Whoever anchors first loses information\n\n3/ Silence is powerful\n  — After making an offer, shut up\n  — Whoever speaks first in the silence concedes\n\n4/ Trade, don't concede\n  — Never give something for nothing\n  — \"If I can do X, will you do Y?\"\n\n5/ Build value before discussing price\n  — Price is only an issue in the absence of value\n\nNegotiation is not about winning.\n\nIt's about getting what you're worth.\n\nWhat's your best negotiation tip?",
  },

  // ── Human Resources ──
  {
    id: "t31",
    industry: "Human Resources",
    title: "Retention strategy",
    text: "People don't quit jobs. They quit managers.\n\nHere's what actually drives retention:\n\n1/ Manager quality > compensation\n  — One bad manager can lose your best people\n\n2/ Growth opportunities > perks\n  — Ping pong tables don't replace career development\n\n3/ Autonomy > surveillance\n  — Trust your people or don't hire them\n\n4/ Recognition > bonuses\n  — A sincere \"thank you\" beats a gift card\n\n5/ Purpose > metrics\n  — People need to know their work matters\n\nThe cost of replacing an employee: 50–200% of annual salary.\n\nThe cost of keeping them happy: a fraction of that.\n\nWhat's your retention strategy?",
  },
  {
    id: "t32",
    industry: "Human Resources",
    title: "Remote culture",
    text: "We've been remote for 4 years.\n\nHere's what actually works for culture:\n\nWhat doesn't work:\n  — Mandatory cameras\n  — Slack-based performance eval\n  — Unlimited PTO (means no one takes any)\n\nWhat does work:\n  — Async-first communication\n  — Regular 1:1s that aren't status updates\n  — Annual in-person gatherings\n  — Clear written processes\n  — Results-oriented trust\n\nRemote culture is not about replicating the office.\n\nIt's about building something better.\n\nHow do you maintain culture remotely?",
  },
  {
    id: "t33",
    industry: "Human Resources",
    title: "Hiring signals",
    text: "I've interviewed 500+ candidates.\n\nHere are the signals that predict success:\n\nGreen flags:\n  ✔ Asks questions about the business, not just the role\n  ✔ Admits what they don't know\n  ✔ Talks about collaboration, not individual heroics\n  ✔ Has a learning mindset (recent projects, courses, reading)\n  ✔ Is selective about what they work on\n\nRed flags:\n  ✖ Blames previous employers\n  ✖ Can't explain their impact vs team impact\n  ✖ Overly focused on title/comp in first conversation\n  ✖ Everything was \"perfect\" at their last company\n  ✖ No curiosity about the role beyond their scope\n\nHire for trajectory, not pedigree.\n\nPast performance is not future potential.\n\nWhat's your favorite interview question?",
  },
  {
    id: "t34",
    industry: "Human Resources",
    title: "Performance reviews",
    text: "Traditional performance reviews are broken.\n\nAnnual reviews:\n  — Too infrequent to be actionable\n  — Too disconnected from daily work\n  — Too biased to be fair\n\nBetter alternatives:\n\n1/ Continuous feedback loops\n  — Weekly 1:1s with real-time feedback\n  — No surprises at review time\n\n2/ 360-degree reviews\n  — Feedback from peers, reports, and managers\n  — More complete picture\n\n3/ Objective-based evaluation\n  — Did they achieve what they committed to?\n  — Focus on outcomes, not hours\n\nPeople want to know how they're doing.\n\nThey don't want to wait 12 months to find out.\n\nHow does your company handle performance feedback?",
  },

  // ── Consulting ──
  {
    id: "t35",
    industry: "Consulting",
    title: "Client onboarding",
    text: "The first 30 days with a client set the tone for the entire engagement.\n\nHere's my onboarding framework:\n\nWeek 1: Discovery deep dive\n  — Stakeholder interviews\n  — Current state assessment\n  — Quick wins identification\n\nWeek 2: Alignment\n  — Present findings\n  — Refine scope\n  — Define success metrics together\n\nWeek 3: Execution kickoff\n  — Quick win delivery (build trust fast)\n  — Establish communication cadence\n  — Set up project infrastructure\n\nWeek 4: Momentum\n  — First milestone review\n  — Adjust approach based on feedback\n  — Plan next 60 days\n\nOnboarding done right = retention for years.\n\nWhat's your onboarding process?",
  },
  {
    id: "t36",
    industry: "Consulting",
    title: "Consulting frameworks",
    text: "5 consulting frameworks every professional should know:\n\n1/ MECE (Mutually Exclusive, Collectively Exhaustive)\n  — Break problems into non-overlapping pieces\n\n2/ The Pyramid Principle\n  — Answer first, supporting arguments second\n\n3/ SWOT Analysis\n  — Strengths, Weaknesses, Opportunities, Threats\n\n4/ Porter's Five Forces\n  — Industry competitive analysis\n\n5/ First Principles Thinking\n  — Break down to fundamental truths, rebuild from there\n\nThese frameworks are tools, not answers.\n\nThe skill is knowing which one to apply.\n\nWhat framework do you use most?",
  },
  {
    id: "t37",
    industry: "Consulting",
    title: "Client communication",
    text: "The #1 consulting skill nobody teaches:\n\nManaging expectations.\n\nHere's how to avoid scope creep and unhappy clients:\n\nBefore the project:\n  — Written scope with clear boundaries\n  — Define \"done\" for each deliverable\n  — Specify what's NOT included\n\nDuring the project:\n  — Weekly status updates (even when there's no progress)\n  — Flag risks early, never surprise bad news\n  — Document every change request\n\nAfter delivery:\n  — Debrief with lessons learned\n  — Get testimonials while results are fresh\n  — Define next engagement before it ends\n\nHappy clients come from managed expectations, not miracles.\n\nWhat's your best client management tip?",
  },
  {
    id: "t38",
    industry: "Consulting",
    title: "Pricing value",
    text: "Stop billing by the hour.\n\nHourly billing punishes efficiency.\n\nValue-based pricing:\n  You're not selling hours. You're selling outcomes.\n\nHow to price by value:\n\n1/ Quantify the impact\n  — If your work saves $500k, charging $50k is a steal\n\n2/ Know your alternatives' cost\n  — Full-time hire: $150k/year + benefits\n  — If you're cheaper AND better, price accordingly\n\n3/ Offer tiers\n  — Basic: Problem solving\n  — Premium: Problem solving + ongoing support\n  — Enterprise: Full partnership\n\n4/ Raise prices annually\n  — If you haven't lost a client due to price, you're too cheap\n\nYour price is a signal of your value.\n\nPrice too low and clients won't trust your expertise.\n\nHow do you price your services?",
  },

  // ── Healthcare ──
  {
    id: "t39",
    industry: "Healthcare",
    title: "Healthcare innovation",
    text: "Healthcare is 10 years behind other industries in technology adoption.\n\nHere's what's finally changing:\n\nTelemedicine:\n  — 38x growth during the pandemic\n  — Patients love the convenience\n  — Regulatory barriers are slowly dropping\n\nAI in diagnostics:\n  — Faster, more accurate reads\n  — Radiologists using AI catch 20% more findings\n  — Still needs human oversight\n\nDigital therapeutics:\n  — Apps with clinical validation\n  — Prescription digital therapeutics are now a category\n\nPatient data ownership:\n  — Patients demanding access to their own data\n  — APIs enabling new care models\n\nThe future of healthcare is preventive, personalized, and patient-driven.\n\nWhat area of healthcare needs the most disruption?",
  },
  {
    id: "t40",
    industry: "Healthcare",
    title: "Burnout in healthcare",
    text: "55% of physicians report feeling burned out.\n\nWe're losing good doctors because the system is broken.\n\nRoot causes:\n  — Excessive documentation (EMR burden)\n  — Administrative overload\n  — Loss of autonomy\n  — insufficient compensation for cognitive work\n\nSolutions that work:\n  — AI-assisted documentation (saves 2+ hours/day)\n  — Team-based care models\n  — Reduced patient loads per physician\n  — Mental health support for providers\n\nWe can't fix patient health without fixing provider well-being.\n\nWhat's the one change you'd make to the healthcare system?",
  },
  {
    id: "t41",
    industry: "Healthcare",
    title: "Preventive health",
    text: "An ounce of prevention is worth a pound of cure.\n\n— Benjamin Franklin\n\nThe healthcare system is built for treatment, not prevention.\n\nHere's what preventive health actually means:\n\nSleep: 7–9 hours\n  — Linked to heart health, immune function, cognition\n\nNutrition: Whole foods > processed\n  — The microbiome affects everything\n\nMovement: 150 min/week moderate exercise\n  — Reduces all-cause mortality by 30%\n\nStress management: Chronic stress is inflammatory\n  — Meditation, therapy, or just walking\n\nSocial connection: Loneliness is as bad as smoking 15 cigarettes/day\n\nThe best medicine is lifestyle.\n\nWhat's one health habit you've started this year?",
  },

  // ── Education ──
  {
    id: "t42",
    industry: "Education",
    title: "Learning how to learn",
    text: "I went back to school at 35.\n\nHere's what I learned about learning:\n\n1/ Understanding > memorization\n  — If you can't explain it simply, you don't understand it\n\n2/ Active recall > passive review\n  — Testing yourself is 2x more effective than re-reading\n\n3/ Spaced repetition > cramming\n  — Review at expanding intervals for long-term retention\n\n4/ Teach to learn\n  — The best way to master something is to teach it\n\n5/ Focus > multitasking\n  — Deep work for 90 min > distracted work for 4 hours\n\nLearning is a skill.\n\nMost people just never learned how to learn.\n\nWhat's something new you're learning right now?",
  },
  {
    id: "t43",
    industry: "Education",
    title: "Future of education",
    text: "The traditional education model is failing.\n\nHere's why:\n\nCost:\n  — College tuition has increased 200% in 30 years\n  — Student debt in the US: $1.7 trillion\n\nRelevance:\n  — Curriculum changes slower than the job market\n  — Skills taught in freshman year are obsolete by graduation\n\nAccess:\n  — Quality education is still a privilege, not a right\n\nWhat's replacing it:\n  — Online learning platforms (Coursera, Udemy)\n  — Apprenticeship models\n  — Micro-credentials and certificates\n  — Company-led training programs\n\nThe future of education is lifelong, modular, and accessible.\n\nSchools should teach how to think, not what to think.\n\nDo you think a college degree is still necessary?",
  },
  {
    id: "t44",
    industry: "Education",
    title: "Teaching kids",
    text: "The most important things I'm teaching my kids:\n\n1/ Curiosity > grades\n  — Ask questions. The answer is less important than the asking.\n\n2/ Resilience > success\n  — How you handle failure defines your future.\n\n3/ Kindness > winning\n  — Being a good person matters more than being the best.\n\n4/ Financial literacy\n  — Save, invest, give. The basics before they're 18.\n\n5/ Critical thinking\n  — Don't believe everything you read. Verify everything.\n\nSchool teaches them what to learn.\n\nI want to teach them how to learn.\n\nWhat's the most important lesson you'd teach a child?",
  },

  // ── Real Estate ──
  {
    id: "t45",
    industry: "Real Estate",
    title: "First home buying",
    text: "Buying your first home? Here's what nobody tells you:\n\n1/ Your budget ≠ what the bank approves\n  — Just because you qualify for $500k doesn't mean you should spend it\n\n2/ Location > property\n  — You can change the house, you can't change the neighborhood\n\n3/ Hidden costs add 2-5%\n  — Closing costs, inspections, moving, immediate repairs\n\n4/ Don't fall in love before the inspection\n  — Every house has issues. Know what you're signing up for.\n\n5/ The best time to buy is when you're ready\n  — Timing the market is impossible. Time in the market wins.\n\nHomeownership is a lifestyle choice as much as a financial one.\n\nMake sure you're ready for both.\n\nWhat's your best advice for first-time buyers?",
  },
  {
    id: "t46",
    industry: "Real Estate",
    title: "Real estate investing",
    text: "I started real estate investing with $0 down.\n\nHere's how:\n\n1/ House hacking\n  — Buy a multi-unit, live in one, rent the others\n  — Your tenants pay your mortgage\n\n2/ BRRRR method\n  — Buy, Rehab, Rent, Refinance, Repeat\n  — Pull equity out to fund the next deal\n\n3/ Wholesaling\n  — Find deals, assign contracts\n  — No capital required\n\n4/ Partnerships\n  — Your work + their money\n  — Split profits proportionally\n\n5/ Seller financing\n  — Seller acts as the bank\n  — No traditional mortgage needed\n\nReal estate is not about having money.\n\nIt's about finding creative ways to get deals done.\n\nWhat's your real estate investing strategy?",
  },
  {
    id: "t47",
    industry: "Real Estate",
    title: "Staging matters",
    text: "Staged homes sell 88% faster and for 20% more.\n\nHere's how to stage like a pro:\n\nLiving room:\n  — Remove personal photos\n  — Neutral color palette\n  — Define each seating area\n\nKitchen:\n  — Clear countertops (only decorative items)\n  — Fresh fruit bowl\n  — Clean appliances\n\nBedrooms:\n  — Neutral bedding\n  — Minimal furniture\n  — Good lighting (warm bulbs)\n\nBathrooms:\n  — Fresh towels, rolled\n  — New shower curtain\n  — Scented candle (subtle)\n\nBuyers need to imagine themselves living there.\n\nYour stuff reminds them they're in YOUR home.\n\nWhat's your best staging tip?",
  },

  // ── Entrepreneurship ──
  {
    id: "t48",
    industry: "Entrepreneurship",
    title: "First hire mistakes",
    text: "I made every hiring mistake possible.\n\nSo you don't have to:\n\nMistake 1: Hiring too fast\n  — Revenue before headcount. Every time.\n\nMistake 2: Hiring for skills, not values\n  — Skills can be taught. Character can't.\n\nMistake 3: Ignoring red flags\n  — That minor concern in the interview? It's a major problem in week 3.\n\nMistake 4: Not firing fast enough\n  — Bad hires cost 2x salary and demoralize the team\n\nMistake 5: Hiring clones of yourself\n  — Different strengths create stronger teams\n\nYour first 10 employees define your company culture.\n\nChoose wisely.\n\nWhat hiring lesson did you learn the hard way?",
  },
  {
    id: "t49",
    industry: "Entrepreneurship",
    title: "Product-market fit",
    text: "Most startups die before finding product-market fit.\n\nHere's what PMF actually looks like:\n\nSigns you have it:\n  — Users are disappointed when you're down\n  — Organic growth is 30%+ month over month\n  — Support tickets are feature requests, not bug reports\n  — Customers would pay 2x your current price\n\nSigns you don't:\n  — You have to convince people to sign up\n  — Churn is > 5% monthly\n  — Usage drops after the first week\n  — You keep changing the product to find what sticks\n\nPMF is binary. You either have it or you don't.\n\nEverything else is optimization after the fact.\n\nAre you building something people actually need?",
  },
  {
    id: "t50",
    industry: "Entrepreneurship",
    title: "Fundraising advice",
    text: "I've raised $10M+ across 3 startups.\n\nHere's what I wish I knew before my first pitch:\n\n1/ Investors bet on patterns, not products\n  — Your deck matters less than your trajectory\n\n2/ Revenue > team > product > idea\n  — The further right on that list, the harder to raise\n\n3/ Warm intros only\n  — Cold inboxes get ignored. Network your way in.\n\n4/ Tell a story, not a feature list\n  — Paint a picture of the future with you in it\n\n5/ The best time to raise is when you don't need to\n  — Desperation smells. Growth attracts.\n\nFundraising is not a validation of your idea.\n\nIt's a partnership decision.\n\nWhat's your biggest fundraising lesson?",
  },
  {
    id: "t51",
    industry: "Entrepreneurship",
    title: "Founder productivity",
    text: "As a founder, your most scarce resource is attention.\n\nHere's how I protect mine:\n\n1/ No meetings before 11am\n  — Mornings are for deep work\n\n2/ Batching all shallow work\n  — Emails, Slack, reviews: once in the afternoon\n\n3/ The 2-minute rule\n  — If it takes <2 min, do it immediately\n  — If it takes >2 min, put it on the list\n\n4/ Saying no to almost everything\n  — Every yes is a no to something more important\n\n5/ Focus on the one thing\n  — What's the single most impactful thing I can do today?\n\nBusy ≠ productive.\n\nMost founders are busy being busy instead of building.\n\nWhat productivity system actually works for you?",
  },
  {
    id: "t52",
    industry: "Entrepreneurship",
    title: "Pivot story",
    text: "Our first product was a total failure.\n\n6 months of building. 12 users. 0 revenue.\n\nHere's what we did wrong:\n\n1/ We built what we wanted, not what users needed\n  — Ego disguised as vision\n\n2/ We assumed, never validated\n  — We thought we knew the problem. We were wrong.\n\n3/ We fell in love with the solution\n  — When your only tool is a hammer, everything looks like a nail\n\nWhat saved us:\n  — We talked to those 12 users\n  — Found the real pain point (not the one we assumed)\n  — Pivoted in 2 weeks, not 6 months\n\nThat pivot was the best decision we ever made.\n\nFailure is just data for the next iteration.\n\nHave you ever had to pivot?",
  },
  {
    id: "t53",
    industry: "Entrepreneurship",
    title: "Bootstrapping vs VC",
    text: "The debate nobody talks about honestly:\n\nBootstrapping:\n  — Full control\n  — Slower growth\n  — Profitable from day 1\n  — Stressful in different ways (cash flow)\n  — You own 100% of what you build\n\nVC-backed:\n  — Dilution (you own less)\n  — Faster growth\n  — Pressure to scale\n  — Board dynamics to manage\n  — Bigger upside potential\n\nThere's no right answer.\n\nIt depends on your personal goals and risk tolerance.\n\nBoth paths can build great companies.\n\nWhich camp are you in and why?",
  },
  {
    id: "t54",
    industry: "Entrepreneurship",
    title: "Co-founder relationships",
    text: "A co-founder relationship is harder than a marriage.\n\nAnd there's no prenup.\n\nHere's how to make it work:\n\n1/ Equity split from day 1\n  — Vesting schedules protect everyone\n  — Don't leave it \"for later\"\n\n2/ Clear roles and decision rights\n  — Who decides what? Document it.\n  — Tie-breaker mechanism for when you disagree\n\n3/ Regular check-ins\n  — Not just on business, on the relationship\n  — How are we working together?\n\n4/ Written agreements\n  — Verbal agreements are worthless\n  — Get everything in writing\n\n5/ Transparency about everything\n  — Financials, doubts, offers, everything\n\nThe best co-founder relationships are built on trust AND structure.\n\nDon't leave it to chance.\n\nWhat's your co-founder story?",
  },

  // ── Leadership ──
  {
    id: "t55",
    industry: "Leadership",
    title: "Leading without authority",
    text: "The best leaders don't need a title.\n\nHere's how to lead from anywhere in the organization:\n\n1/ Earn trust before asking for anything\n  — Deliver value first\n\n2/ Influence through expertise\n  — Be the person who knows their stuff\n\n3/ Build bridges, not walls\n  — Connect people and ideas\n\n4/ Take initiative\n  — See a problem? Propose a solution.\n\n5/ Give credit generously\n  — When others succeed, the leader looks good\n\n6/ Communicate clearly\n  — Ambiguity is the enemy of action\n\n7/ Stay calm under pressure\n  — Your composure sets the tone\n\nLeadership is a behavior, not a position.\n\nHow do you lead without a title?",
  },
  {
    id: "t56",
    industry: "Leadership",
    title: "Decision-making",
    text: "The quality of your decisions determines the quality of your life.\n\nHere's my decision-making framework:\n\nFor reversible decisions:\n  — Decide fast, move fast\n  — You can always change course\n\nFor irreversible decisions:\n  — Slow down, gather data\n  — Consult multiple perspectives\n  — Sleep on it\n\nFor difficult decisions:\n  — Write down the pros and cons\n  — Ask: \"What would I tell my best friend to do?\"\n  — Consider the downside: can you survive it?\n\nFor strategic decisions:\n  — Align with long-term values\n  — Short-term pain for long-term gain\n\nMost decisions don't need as much analysis as we give them.\n\nMake the call. Move on.\n\nWhat's the hardest decision you've made this year?",
  },
  {
    id: "t57",
    industry: "Leadership",
    title: "Giving feedback",
    text: "Feedback is a gift.\n\nMost people just wrap it terribly.\n\nHere's how to give feedback that actually lands:\n\n1/ Ask permission first\n  — \"Can I share some thoughts?\"\n  — Creates psychological safety\n\n2/ Be specific, not general\n  — Instead of \"Great job\" → \"The way you handled that objection was excellent\"\n\n3/ Focus on behavior, not character\n  — \"The report had errors\" vs \"You're careless\"\n\n4/ Balance positive and constructive\n  — The 3:1 ratio for high-performing teams\n\n5/ Make it a conversation\n  — \"What do you think?\" after sharing\n\n6/ Follow up\n  — Check in later to see how it's going\n\nFeedback is about helping someone grow.\n\nIf it doesn't do that, it's just criticism.\n\nHow do you give feedback?",
  },
  {
    id: "t58",
    industry: "Leadership",
    title: "Delegation",
    text: "If you want something done right, do it yourself.\n\nThis is the worst leadership advice ever.\n\nHere's how to delegate effectively:\n\n1/ Match task to skill level\n  — Don't give stretch assignments to someone already overwhelmed\n\n2/ Define the outcome, not the process\n  — \"We need X by Friday\" vs \"Do A, then B, then C\"\n\n3/ Provide context, not just instructions\n  — Why this matters, who it affects, what's at stake\n\n4/ Give authority with responsibility\n  — If they own the outcome, let them own the decisions\n\n5/ Check progress without micromanaging\n  — Set milestones, not hourly check-ins\n\nDelegation is not dumping.\n\nIt's developing your team.\n\nWhat's the hardest thing for you to delegate?",
  },
  {
    id: "t59",
    industry: "Leadership",
    title: "Building trust",
    text: "Trust is built in drops and lost in buckets.\n\n— Kevin Stephens\n\nHere's how to build trust as a leader:\n\nReliability:\n  — Do what you say you'll do\n  — Consistency over time\n\nVulnerability:\n  — Admit mistakes openly\n  — Show your humanity\n\nCompetence:\n  — Know your stuff\n  — Keep learning\n\nFairness:\n  — Treat everyone consistently\n  — Credit where due\n\nIntegrity:\n  — Do the right thing, even when no one's watching\n  — Values aren't negotiable\n\nTrust is the currency of leadership.\n\nWithout it, you're just managing.\n\nWhat builds trust for you?",
  },
  {
    id: "t60",
    industry: "Leadership",
    title: "Meeting culture",
    text: "The average executive spends 23 hours per week in meetings.\n\nMost of them are useless.\n\nHere's how to fix meeting culture:\n\nOnly schedule if:\n  — There's a clear agenda shared in advance\n  — A decision needs to be made\n  — Real-time discussion is necessary\n\nIf it's just for information, send an email or a Loom.\n\nMeeting rules:\n  — Start on time, end early\n  — No laptops or phones\n  — Every meeting ends with action items\n\nAlternatives to meetings:\n  — Async updates (Slack, Notion)\n  — Written status reports\n  — 15-minute standups\n\nThe best meeting is the one that didn't need to happen.\n\nHow many of your meetings today could have been emails?",
  },

  // ── Personal Development ──
  {
    id: "t61",
    industry: "Personal Development",
    title: "Morning routine",
    text: "My morning routine changed my life.\n\nNot because of the activities.\n\nBecause of the consistency.\n\nHere's what I do (and why):\n\n5:30am — Wake up (no snooze)\n  — Snoozing trains your brain that alarms are optional\n\n5:35am — Cold shower\n  — Builds discipline. The hardest thing you'll do before 6am.\n\n5:45am — 10 min meditation\n  — Sets the mental tone for the day\n\n6:00am — 30 min reading\n  — Input before output\n\n6:30am — Exercise\n  — Body before mind\n\nThe details don't matter.\n\nThe routine does.\n\nWhat's your morning routine?",
  },
  {
    id: "t62",
    industry: "Personal Development",
    title: "Reading habits",
    text: "I read 50+ books a year.\n\nHere's my system:\n\n1/ Always have a book on you\n  — Physical book, Kindle, or Audible\n  — Every wait becomes reading time\n\n2/ Read multiple books at once\n  — 1 fiction, 1 non-fiction, 1 professional\n  — Switch based on mood\n\n3/ Take notes\n  — Highlight and summarize every book\n  — Review notes quarterly\n\n4/ Apply what you learn\n  — Reading without action is entertainment\n\n5/ Abandon bad books\n  — If it's not clicking after 50 pages, move on\n  — Too many good books to waste time on mediocre ones\n\nReading compounds.\n\n10 pages a day = 3650 pages a year = ~12 books.\n\nWhat are you reading right now?",
  },
  {
    id: "t63",
    industry: "Personal Development",
    title: "Imposter syndrome",
    text: "I've felt like a fraud every day for 10 years.\n\nHere's what I've learned about imposter syndrome:\n\nIt's not a bug. It's a feature.\n\nImposter syndrome means:\n  — You're stretching beyond your comfort zone\n  — You're aware of how much you don't know\n  — You care about doing good work\n\nThe only people who never feel it are the ones who should.\n\nHere's what helps:\n  — Keep a \"wins\" folder (screenshots of kind messages)\n  — Remember that everyone is figuring it out\n  — Focus on the value you provide, not your perceived flaws\n\nYou belong here.\n\nThe fact that you doubt yourself is proof that you're growing.\n\nDo you struggle with imposter syndrome?",
  },
  {
    id: "t64",
    industry: "Personal Development",
    title: "Habit stacking",
    text: "The easiest way to build new habits:\n\nStack them on existing ones.\n\nCalled \"habit stacking\" — it's the most effective technique I've found.\n\nExamples:\n\nAfter I pour my morning coffee → I write 3 things I'm grateful for\nAfter I brush my teeth → I do 10 push-ups\nAfter I sit down at my desk → I open my task list and prioritize\nAfter I finish lunch → I take a 5-minute walk\nAfter I get into bed → I read for 20 minutes\n\nThe formula:\n\n\"After I do [current habit], I will do [new habit].\"\n\nThis works because the existing habit triggers the new one.\n\nYou don't need motivation. You need a system.\n\nWhat habit stack will you start tomorrow?",
  },
  {
    id: "t65",
    industry: "Personal Development",
    title: "Stoicism at work",
    text: "Stoicism made me a better professional.\n\n3 principles that changed my career:\n\n1/ The Dichotomy of Control\n  — Focus only on what you can control\n  — Your effort, your attitude, your preparation\n  — Let go of outcomes, other people's opinions, market conditions\n\n2/ Negative Visualization\n  — Imagine losing what you have\n  — Gratitude for the present becomes automatic\n  — Preparedness for worst-case scenarios\n\n3/ Memento Mori\n  — Remember that you will die\n  — Not morbid — clarifying\n  — It helps prioritize what actually matters\n\nStoicism isn't about suppressing emotions.\n\nIt's about choosing which ones to act on.\n\nWhat philosophy guides your work?",
  },

  // ── Technology (more) ──
  {
    id: "t66",
    industry: "Technology",
    title: "API-first design",
    text: "We built API-first. Here's what we learned:\n\n1/ Design the API before writing any UI code\n  — Forces you to think about data, not pixels\n\n2/ Consistency is king\n  — Naming conventions, error formats, auth patterns\n  — Every endpoint should feel familiar\n\n3/ Version from day 1\n  — /v1/ is cheap to add, expensive to retrofit\n\n4/ Documentation is a feature\n  — Great DX == fewer support tickets\n\n5/ Rate limiting is essential\n  — Protect your service from day one\n\nGood APIs make your product extensible beyond what you planned.\n\nWhat's your API design philosophy?",
  },
  {
    id: "t67",
    industry: "Technology",
    title: "Code review culture",
    text: "Code review is not about catching bugs.\n\nIt's about sharing knowledge.\n\nHere's how we made code reviews productive:\n\nWhat we changed:\n  — Review size: max 400 lines per review\n  — Review time: within 4 hours, not 4 days\n  — Review tone: questions, not accusations\n  — Review goal: shared understanding, not perfection\n\nWhat we stopped:\n  — Nitpicking style (that's what formatters are for)\n  — Gatekeeping with personal preferences\n  — Requesting changes without explanation\n\nResults:\n  — 50% faster merge times\n  — More junior contributions\n  — Fewer \"my code\" vs \"their code\" silos\n\nCode review is a conversation.\n\nMake it a productive one.\n\nWhat's your code review pet peeve?",
  },
  {
    id: "t68",
    industry: "Technology",
    title: "Monolith vs microservices",
    text: "You don't need microservices.\n\nHere's the honest truth:\n\nStart with a monolith:\n  — Faster to build\n  - Easier to debug\n  — Cheaper to run\n  — One developer can understand the whole system\n\nExtract services when:\n  — The monolith has clear domain boundaries\n  — A specific service needs independent scaling\n  — You have a team to own each service\n  — You understand the domain well enough to split it\n\nPremature microservices are like premature optimization.\n\nYou're adding complexity without proven need.\n\nWhat architectural decisions are you making right now?",
  },

  // ── Marketing (more) ──
  {
    id: "t69",
    industry: "Marketing",
    title: "Email list building",
    text: "Your email list is the only asset you actually own.\n\nSocial algorithms change. Your list doesn't.\n\nHere's how to build one that matters:\n\n1/ Lead magnets that solve real problems\n  — Templates, checklists, guides\n  — Not \"subscribe to our newsletter\"\n\n2/ Popups that don't annoy\n  — Exit-intent only\n  — Offer value, not just \"sign up\"\n\n3/ Welcome sequence that delivers\n  — First email: Deliver the lead magnet\n  — Second email: Share your story\n  — Third email: Show them what's possible\n\n4/ Consistent nurturing\n  — Weekly, not daily\n  — Value-first, promotion-second\n\nYour list is worth $1/subscriber/year at minimum.\\nBuild it before you need it.\n\nWhat's your email list growth strategy?",
  },
  {
    id: "t70",
    industry: "Marketing",
    title: "SEO fundamentals",
    text: "SEO is not dead.\n\nBad content is dead.\n\nHere's what still works:\n\n1/ Write for humans, optimize for search engines\n  — Natural language, keyword rich but not stuffed\n\n2/ Answer real questions\n  — \"People also ask\" is a goldmine\n  — Write the content people are searching for\n\n3/ Structure matters\n  — H1, H2, H3 hierarchy\n  — Short paragraphs, bullet points, tables\n\n4/ Build topical authority\n  — Don't write one article on a topic, write 10\n  — Become the resource\n\n5/ Internal linking\n  — Connect your content\n  — Distribute page authority\n\n6/ Technical SEO basics\n  — Site speed, mobile-friendliness, sitemaps\n\nSEO is a long game.\n\nBut it compounds beautifully.\n\nWhat's your SEO strategy for 2026?",
  },
  {
    id: "t71",
    industry: "Marketing",
    title: "Viral mechanics",
    text: "Viral content follows patterns.\n\nHere are the 7 viral mechanics:\n\n1/ High-emotion triggers\n  — Awe, anger, joy, surprise\n  — Low-emotion content rarely spreads\n\n2/ Practical value\n  — People share what helps others\n  — Checklists, templates, how-tos\n\n3/ Social currency\n  — Sharing makes them look smart/funny/insightful\n  — Status-transmitting content\n\n4/ Storytelling\n  — Narratives are easier to remember and retell\n\n5/ Triggers\n  — Content associated with everyday experiences\n  — \"Whenever I see X, I think of Y\"\n\n6/ Public visibility\n  — Things that are observable are more imitable\n\n7/ Pattern interruption\n  — Unexpected twists grab attention\n\nWhich mechanic does your content use?",
  },

  // ── Sales (more) ──
  {
    id: "t72",
    industry: "Sales",
    title: "Referral generation",
    text: "The best leads are referrals.\n\n10x higher conversion rate. 30% larger deal size.\n\nHere's how to generate more referrals:\n\n1/ Ask at the right time\n  — Right after a win, when excitement is high\n  — Not during the sales process\n\n2/ Make it easy\n  — Provide a template they can forward\n  — \"Here's exactly what to say to [referral name]\"\n\n3/ Give referrals to get referrals\n  — Be a connector for your network\n  — What goes around comes around\n\n4/ Create a formal program\n  — Incentives, tracking, recognition\n  — Make it a system, not an afterthought\n\n5/ Thank referrers publicly\n  — Social proof + appreciation\n  — Others will want the same recognition\n\nReferrals are the highest-quality leads.\n\nAnd they're completely free.\n\nHow many referrals did you generate last quarter?",
  },
  {
    id: "t73",
    industry: "Sales",
    title: "CRM hygiene",
    text: "Your CRM is only as good as the data in it.\n\nHere's how to keep it clean:\n\n1/ Log everything immediately\n  — If it's not in the CRM, it didn't happen\n  — Do it right after the call, not \"later\"\n\n2/ Standardize fields\n  — No \"call with John\" notes\n  — Use templates for consistency\n\n3/ Clean duplicates weekly\n  — Merge, don't delete\n  — Deduplication saves hours\n\n4/ Update stages honestly\n  — Deals don't move forward? Move them back.\n  — A deal in \"negotiation\" for 6 months is not in negotiation\n\n5/ Archive, don't abandon\n  — Lost deals have data too\n  — They might come back\n\nBad CRM data leads to bad decisions.\n\nGood data leads to predictable revenue.\n\nHow clean is your CRM?",
  },

  // ── Design (more) ──
  {
    id: "t74",
    industry: "Design",
    title: "Color theory",
    text: "Color is not decorative. It's functional.\n\nHere's what every designer should know:\n\nColor psychology:\n  — Blue: Trust, professionalism\n  — Green: Growth, health\n  — Red: Urgency, excitement\n  — Yellow: Optimism, warmth\n  — Purple: Creativity, luxury\n  — Orange: Confidence, friendliness\n\nAccessibility:\n  — Contrast ratio: WCAG AA (4.5:1) minimum\n  — Don't rely on color alone for information\n  — Test with color blindness simulators\n\nPalette creation:\n  — 1 primary, 1 secondary, 1 accent\n  — Neutrals for text and backgrounds\n  — 60-30-10 rule\n\nColor evokes emotion before words register.\n\nUse it intentionally.\n\nWhat color palette are you using and why?",
  },
  {
    id: "t75",
    industry: "Design",
    title: "Accessibility first",
    text: "Accessibility is not a feature.\n\nIt's a fundamental design requirement.\n\n1 in 5 people have a disability.\n\nDesigning for accessibility means:\n\nScreen readers:\n  — Semantic HTML (headings, landmarks, alt text)\n  — ARIA labels where needed\n  — Test with actual screen readers\n\nNavigation:\n  — Full keyboard support\n  — Visible focus indicators\n  — Logical tab order\n\nContent:\n  — Plain language\n  — Descriptive links (not \"click here\")\n  — Caption all video content\n\nVisual:\n  — Sufficient color contrast\n  — Scalable text (no fixed sizes)\n  — Don't use color as the only differentiator\n\nAccessibility is not about compliance.\n\nIt's about inclusion.\n\nHow accessible is your product?",
  },

  // ── Finance (more) ──
  {
    id: "t76",
    industry: "Finance",
    title: "Emergency fund",
    text: "The single most important financial step:\n\nAn emergency fund.\n\nHere's why:\n\nWithout it:\n  — One car repair = credit card debt\n  — One medical bill = drained savings\n  — One layoff = financial crisis\n\nWith it:\n  — Unexpected expenses are inconvenient, not catastrophic\n  — You can negotiate from a position of strength\n  — You sleep better at night\n\nHow much:\n  — 3-6 months of essential expenses\n  — In a high-yield savings account (4-5% APY)\n  — Not invested (you need it liquid)\n\nStart small. $1,000. Then 1 month. Then 3. Then 6.\n\nEvery dollar counts.\n\nDo you have an emergency fund?",
  },
  {
    id: "t77",
    industry: "Finance",
    title: "Side hustle math",
    text: "Your side hustle should not be more work for less pay.\n\nHere's how to evaluate a side hustle:\n\nHourly rate:\n  — Active income: You trade time for money (Uber, freelancing)\n  — Passive income: You build once, earn repeatedly (courses, digital products)\n  — Scalable income: You build systems that multiply effort (SaaS, content)\n\nTime to revenue:\n  — Immediate: Low barrier, low ceiling\n  — 3-6 months: Medium barrier, medium ceiling\n  — 12+ months: High barrier, high ceiling\n\nReal hourly rate:\n  — Don't just count earning time\n  — Include marketing, admin, learning, taxes\n\nSide hustles are great for exploring new income streams.\n\nBut they shouldn't be a second job that pays minimum wage.\n\nWhat's your side hustle strategy?",
  },

  // ── Consulting (more) ──
  {
    id: "t78",
    industry: "Consulting",
    title: "Selling consulting engagements",
    text: "Selling consulting is different from selling products.\n\nYou're not selling a thing. You're selling trust.\n\nHere's how to close consulting deals:\n\n1/ Diagnose before prescribing\n  — Free 30-minute discovery call\n  — Show them what's broken before offering to fix it\n\n2/ Scope tightly\n  — Define exactly what success looks like\n  — Fixed scope, fixed price (or retainer)\n\n3/ Social proof is everything\n  — Case studies, testimonials, referrals\n  — \"We did X for Y, and they got Z\"\n\n4/ Build urgency\n  — Limited availability (you are the product)\n  — \"I have capacity for 2 new clients this quarter\"\n\n5/ Over-deliver on the first engagement\n  — First project ROI determines lifetime value\n\nConsulting is a relationship business.\n\nEvery client is a reference.\n\nHow do you sell your consulting services?",
  },
  {
    id: "t79",
    industry: "Consulting",
    title: "Deliverables that impress",
    text: "The best consultants deliver insights, not just work.\n\nHere's what separates good from great deliverables:\n\nGood:\n  — Complete and accurate\n  — On time, on budget\n  — Meets scope requirements\n\nGreat:\n  — Anticipates follow-up questions\n  — Provides actionable recommendations, not just analysis\n  — Beautifully designed and easy to navigate\n  — Includes a clear next-steps plan\n\nExtraordinary:\n  — Identifies problems they didn't know they had\n  — Includes implementation guidance\n  — Provides tools/templates they can use beyond the engagement\n  — Makes the client look brilliant to their boss\n\nDeliverables are artifacts of your thinking.\n\nMake them memorable.\n\nWhat makes a consulting deliverable great?",
  },

  // ── Personal Development (more) ──
  {
    id: "t80",
    industry: "Personal Development",
    title: "Networking that works",
    text: "Networking is not collecting business cards.\n\nIt's building genuine relationships.\n\nHere's my networking approach:\n\nBefore the event:\n  — Research attendees (who do you want to meet?)\n  — Prepare 3 questions, not a pitch\n\nDuring the event:\n  — Ask questions, listen more than you talk\n  — Look for ways to help others\n  — Connect on LinkedIn immediately\n\nAfter the event:\n  — Follow up within 24 hours\n  — Reference something specific from your conversation\n  — Offer value (article, intro, resource)\n\nOngoing:\n  — Engage with their content\n  — Check in every 3-6 months\n  — Be generous without expecting returns\n\nYour network is your net worth.\n\nBut only if you genuinely invest in it.\n\nWhat's your networking strategy?",
  },
  {
    id: "t81",
    industry: "Personal Development",
    title: "Time management",
    text: "You don't need more time management hacks.\n\nYou need to decide what to stop doing.\n\nHere's my elimination framework:\n\n1/ What can I stop doing entirely?\n  — Meetings without agendas\n  — Checking email more than twice a day\n  — Perfectionism on low-impact tasks\n\n2/ What can I automate?\n  — Bill payments\n  — Social media scheduling\n  — Email filters and templates\n\n3/ What can I delegate?\n  — Tasks someone else can do at 80% quality\n  — Things that don't require your specific expertise\n\n4/ What can I do less of?\n  — Reduce scope, not quality\n  — 80/20 rule: focus on the vital few\n\nTime is your most non-renewable resource.\n\nSpend it like it's precious.\n\nWhat are you going to stop doing?",
  },
  {
    id: "t82",
    industry: "Personal Development",
    title: "Growth mindset",
    text: "\"I can't do this\" vs \"I can't do this yet.\"\n\nOne word makes all the difference.\n\nGrowth mindset in action:\n\nWhen you fail:\n  — Fixed: \"I'm not good at this\"\n  — Growth: \"What can I learn from this?\"\n\nWhen you're challenged:\n  — Fixed: \"This is too hard\"\n  — Growth: \"This is how I grow\"\n\nWhen others succeed:\n  — Fixed: \"They got lucky\"\n  — Growth: \"What can I learn from them?\"\n\nWhen you make a mistake:\n  — Fixed: \"I'm embarrassed\"\n  — Growth: \"Mistakes are data\"\n\nThe brain is a muscle.\n\nIt grows with effort.\n\nWhere in your life could a growth mindset help?",
  },
  {
    id: "t83",
    industry: "Personal Development",
    title: "Journaling practice",
    text: "I've journaled every day for 5 years.\n\nHere's what it's done for me:\n\nClarity:\n  — Writing untangles thoughts\n  — Problems look different on paper\n\nGratitude:\n  — Forcing 3 good things per day rewires your brain\n  — You start noticing what's going right\n\nDecision-making:\n  — Pros and cons become clear\n  — Emotional reactions vs rational responses\n\nProgress tracking:\n  — Look back and see how far you've come\n  — Patterns become visible\n\nCreativity:\n  — Morning pages unlock ideas\n  — Quantity leads to quality\n\nMy system:\n  — 5 minutes every morning\n  — 3 things I'm grateful for + 1 page of free writing\n  — No judgment, no editing\n\nYou don't need to be a writer to journal.\n\nYou just need to be honest.\n\nDo you journal?",
  },

  // ── Entrepreneurship (more) ──
  {
    id: "t84",
    industry: "Entrepreneurship",
    title: "Customer discovery",
    text: "The most dangerous phrase in startups:\n\n\"I think people will want this.\"\n\nHere's how to validate before building:\n\nCustomer discovery framework:\n\n1/ Define your hypothesis\n  — Problem: \"X is painful for Y\"\n  — Solution: \"We solve X by Z\"\n\n2/ Find 10-20 people who match Y\n  — LinkedIn, Twitter, communities\n  — DM them with a genuine ask\n\n3/ Interview (don't pitch)\n  — \"Tell me about a time you experienced X\"\n  — Listen for pain, emotion, and workarounds\n  — Don't mention your solution yet\n\n4/ Look for patterns\n  — Do at least 10 interviews before deciding\n  — Common pain + strong emotion + existing workaround = real problem\n\n5/ Validate with a landing page\n  — Describe the solution\n  — Measure sign-ups before building\n\nTalk to customers before writing code.\n\nIt will save you months of building the wrong thing.\n\nWhat's your validation process?",
  },
  {
    id: "t85",
    industry: "Entrepreneurship",
    title: "Pricing strategy",
    text: "Your pricing is a product decision.\n\nHere's how to think about it:\n\nCost-plus pricing (wrong):\n  — \"It costs us $10, so we'll charge $20\"\n  — Ignores value entirely\n\nCompetitor-based pricing (dangerous):\n  — \"Our competitor charges $50, so we will too\"\n  — Assumes they know what they're doing\n\nValue-based pricing (right):\n  — \"Our solution saves customers $10k/year, so we charge $2k\"\n  — Based on the value you deliver\n\nPricing psychology:\n  — Charm pricing ($49 vs $50)\n  — Anchoring (show expensive option first)\n  — Tiering (decoy effect)\n\nTest your pricing.\n\nIf you haven't lost a customer to price, you're too cheap.\n\nWhat's your pricing strategy?",
  },
  {
    id: "t86",
    industry: "Entrepreneurship",
    title: "Customer support",
    text: "Support is not a cost center.\n\nIt's your best source of product insights.\n\nHere's how to build a support-driven growth engine:\n\n1/ Respond fast\n  — Under 1 hour during business hours\n  — Speed correlates with satisfaction\n\n2/ Listen for patterns\n  — The same question 3 times = documentation gap\n  — The same complaint 3 times = product issue\n\n3/ Turn complaints into features\n  — \"I wish I could X\" = feature request\n  - Log every piece of feedback\n\n4/ Delight, not just solve\n  — Go beyond the question\n  — Add a bonus tip or resource\n\n5/ Close the loop\n  — Follow up to confirm resolution\n  — Ask for feedback on the support experience\n\nEvery support interaction is a product research opportunity.\n\nDon't waste it.\n\nHow do you handle customer support?",
  },

  // ── Leadership (more) ──
  {
    id: "t87",
    industry: "Leadership",
    title: "Remote team management",
    text: "Managing a remote team requires different skills.\n\nHere's what I've learned:\n\nOver-communicate:\n  — In the office, information travels through osmosis\n  — Remotely, write everything down\n  — Default to transparency\n\nAsync-first:\n  — Not everything needs a meeting\n  — Use Loom for updates, Slack for quick questions\n  — Document decisions in a shared space\n\nTrust, but verify:\n  — Hire people you trust\n  — Measure outcomes, not hours\n  — Give autonomy with accountability\n\nFight isolation:\n  — Watercooler channels, virtual coffees\n  — Annual retreats (worth every dollar)\n  — Recognize publicly, frequently\n\nRemote work amplifies good management.\n\nAnd it exposes bad management.\n\nWhat's your best remote leadership tip?",
  },
  {
    id: "t88",
    industry: "Leadership",
    title: "Conflict resolution",
    text: "Conflict is inevitable in high-performing teams.\n\nThe question is how you handle it.\n\nHere's my conflict resolution framework:\n\n1/ Address early, address directly\n  — Unaddressed conflict festers\n  — Have the conversation within 24 hours\n\n2/ Focus on the issue, not the person\n  — \"The deadline was missed\" vs \"You're unreliable\"\n  — Separate behavior from identity\n\n3/ Seek to understand first\n  — \"Help me understand your perspective\"\n  — Listen without preparing your response\n\n4/ Find common ground\n  — What do we both want?\n  — Build from agreement, not disagreement\n\n5/ Commit to a path forward\n  — Specific action items\n  — Follow-up to ensure resolution\n\nThe strongest teams are not the ones without conflict.\n\nThey're the ones that resolve it constructively.\n\nHow do you handle team conflict?",
  },
  {
    id: "t89",
    industry: "Leadership",
    title: "One-on-ones",
    text: "Most 1:1s are a waste of time.\n\nStatus updates belong in Slack.\n\nHere's how to run effective 1:1s:\n\nManager's role:\n  — Listen 80%, talk 20%\n  — Ask questions, don't give orders\n  — Remove blockers\n\nBetter questions to ask:\n  — \"What's been your highlight this week?\"\n  — \"What's something you'd like more of?\"\n  — \"What's something you'd like less of?\"\n  — \"How can I support you better?\"\n  — \"What's a skill you want to develop?\"\n\nThe 1:1 is not for the manager.\n\nIt's for the direct report.\n\nWhat does your 1:1 structure look like?",
  },

  // ── Technology (more) ──
  {
    id: "t90",
    industry: "Technology",
    title: "On-call best practices",
    text: "On-call doesn't have to be miserable.\n\nHere's how to build a healthy on-call culture:\n\n1/ Blameless postmortems\n  — Assume good intent\n  — Fix the system, not the person\n\n2/ Runbooks for everything\n  — If it can break, there should be a recovery script\n  — Document what to check, in order\n\n3/ Alert fatigue is real\n  — Every alert should require action\n  — If nobody acts on it for a month, remove it\n\n4/ Follow-the-sun rotation\n  — Spread the burden across time zones\n  — No 3am pages if there's a daytime team\n\n5/ Compensation\n  — Pay for on-call time\n  — Compensate interrupted sleep\n\n6/ Post-incident reviews\n  — Share learnings across the org\n  — Track mean time to resolve\n\nGood on-call practices build resilient systems.\n\nAnd happy engineers.\n\nWhat's your on-call experience?",
  },
  {
    id: "t91",
    industry: "Technology",
    title: "Developer experience",
    text: "Your developers are your first users.\n\nIf they're frustrated, your product will suffer.\n\nHere's how to invest in developer experience:\n\n1/ Fast feedback loops\n  — Hot reload, instant tests\n  — Slow builds kill momentum\n\n2/ Great documentation\n  — README that actually works\n  — API docs with examples\n  — Onboarding guide for new devs\n\n3/ Good tooling\n  — Linters, formatters, type checking\n  — CI that runs in minutes, not hours\n\n4/ Clear architecture\n  — Well-defined boundaries\n  — Consistent patterns\n  — Easy to find what you need\n\n5/ Psychological safety\n  — It's okay to ask questions\n  — No blame for mistakes\n  — Learning is valued\n\nHappy developers ship better products.\n\nWhat's the best DX improvement you've made?",
  },
  {
    id: "t92",
    industry: "Technology",
    title: "Database scaling lessons",
    text: "We outgrew our database at 100k users.\n\nHere's what we learned:\n\n1/ Index early, index often\n  — Check EXPLAIN ANALYZE before shipping queries\n  — Missing indexes are silent performance killers\n\n2/ Connection pooling is not optional\n  — Every connection consumes resources\n  - Use PgBouncer or similar\n\n3/ Read replicas for read-heavy workloads\n  — Separate read and write paths\n  — Invalidate cache, not replicas\n\n4/ Sharding is a last resort\n  — Try caching first\n  — Try read replicas second\n  — Sharding adds massive complexity\n\n5/ Regular vacuuming\n  — PostgreSQL bloat is real\n  — Maintenance matters\n\nDatabase problems are good problems.\n\nThey mean you're growing.\n\nWhat database lessons have you learned?",
  },

  // ── Healthcare (more) ──
  {
    id: "t93",
    industry: "Healthcare",
    title: "Patient experience",
    text: "Healthcare is the only industry where customers are called \"patients.\"\n\nAnd they're treated like it.\n\nHere's how to improve patient experience:\n\n1/ Reduce wait times\n  — 20 minutes average is the expectation\n  — Every minute beyond that erodes trust\n\n2/ Communicate clearly\n  — Medical jargon is a barrier\n  — Plain language builds understanding\n\n3/ Digital access\n  — Online booking, test results, messaging\n  — Patients expect what they get from every other industry\n\n4/ Empathy in every interaction\n  — From reception to doctor to billing\n  — Healthcare is inherently stressful\n\n5/ Follow-up after visits\n  — Check in on progress\n  — Show you care beyond the appointment\n\nHealthcare should be patient-centered, not system-centered.\n\nWhat would improve your experience as a patient?",
  },

  // ── Education (more) ──
  {
    id: "t94",
    industry: "Education",
    title: "Online courses",
    text: "I've created 7 online courses.\n\nHere's what I learned about what actually works:\n\nStructure:\n  — Modules of 3-5 lessons each\n  — Lessons under 15 minutes\n  — One concept per lesson\n\nEngagement:\n  — Worksheets and exercises after each module\n  — Community for discussion\n  — Weekly live Q&A sessions\n\nPricing:\n  — $100-500 is the sweet spot\n  — Too cheap = low commitment = low completion\n  — Money-back guarantee (high completion rates justify it)\n\nMarketing:\n  — Free mini-course as lead magnet\n  — Student testimonials on landing page\n  — Launch with an email sequence\n\nThe best online courses don't just teach.\n\nThey transform.\n\nWhat subject would you teach?",
  },
  {
    id: "t95",
    industry: "Education",
    title: "Mentorship",
    text: "Everyone needs a mentor.\n\nAnd eventually, everyone should be one.\n\nHere's how to find a mentor:\n\n1/ Be specific about what you want\n  — \"Can you mentor me?\" is too vague\n  — \"I'm trying to break into product management. Could I ask you about your path?\" is better\n\n2/ Do the work first\n  — Show initiative before asking for help\n  — \"I read your book/article/talk and applied it to X\"\n\n3/ Start small\n  — Ask for 15 minutes, not a monthly commitment\n  — Prove you're worth investing in\n\n4/ Be a good mentee\n  — Come prepared with specific questions\n  - Take notes\n  — Follow up on advice given\n\n5/ Pay it forward\n  — Mentor someone else when you can\n  — The best way to learn is to teach\n\nThe best mentors are learning too.\n\nWho do you look up to?",
  },
  {
    id: "t96",
    industry: "Education",
    title: "Public speaking",
    text: "Public speaking is the #1 fear above death.\n\nHere's how to speak with confidence:\n\nPreparation:\n  — Know your audience, not just your slides\n  — Structure: tell them what you'll say, say it, tell them what you said\n  — Practice out loud (thinking is not practicing)\n\nDuring the talk:\n  — Start with a story, not a slide\n  — Make eye contact with friendly faces\n  — Speak slower than you think you need to\n  — Silence is powerful. Use pauses.\n\nHandling nerves:\n  — Deep breaths before starting\n  — Reframe: excitement, not anxiety\n  — Remember: the audience wants you to succeed\n\nSlides:\n  — One idea per slide\n  — Minimal text (you are the presentation)\n  — Images > bullet points\n\nThe goal is not perfection.\n\nIt's connection.\n\nWhat speaking opportunity are you preparing for?",
  },

  // ── Marketing (more) ──
  {
    id: "t97",
    industry: "Marketing",
    title: "Brand voice guide",
    text: "Your brand voice is how you speak.\n\nYour brand tone is how you adapt that voice.\n\nHere's how to build a brand voice guide:\n\nVoice dimensions:\n  — Formal vs casual\n  — Serious vs playful\n  — Respectful vs irreverent\n  — Enthusiastic vs matter-of-fact\n\nDo's and don'ts:\n  — Words to use / avoid\n  — Sentence length preferences\n  — Punctuation rules (exclamation marks? em-dashes?)\n\nExamples:\n  — Before/after re-writes\n  — Good examples from your content\n  — Bad examples from competitors\n\nTone variations:\n  — Happy event vs crisis response\n  — Product launch vs customer support\n  — Social media vs email vs website\n\nA great brand voice guide is used, not filed.\n\nDoes your team have one?",
  },
  {
    id: "t98",
    industry: "Marketing",
    title: "Community building",
    text: "Community is the new marketing.\n\nHere's how to build one that lasts:\n\n1/ Start with a purpose, not a platform\n  — Why should this community exist?\n  — What value do members get?\n\n2/ Show up consistently\n  — Post daily, engage hourly\n  — Be the heartbeat of the community\n\n3/ Member-spotlight, not brand-spotlight\n  — Celebrate member wins\n  — User-generated content is gold\n\n4/ Create rituals\n  — Weekly threads, monthly AMAs, annual events\n  — Consistency builds belonging\n\n5/ Charge (eventually)\n  — Free communities have lower engagement\n  — Paid communities have aligned incentives\n\n6/ Empower superfans\n  — Give your most engaged members leadership roles\n  — They'll do your best marketing for free\n\nA strong community is a moat.\n\nAre you building one?",
  },

  // ── Entrepreneurship (more) ──
  {
    id: "t99",
    industry: "Entrepreneurship",
    title: "SaaS metrics",
    text: "The SaaS metrics that actually matter:\n\nMRR (Monthly Recurring Revenue):\n  — The lifeblood of your business\n  — Track growth rate weekly\n\nChurn:\n  — Monthly: <5% is good, <2% is great\n  — Annual: <10% is good, <5% is great\n  — The single highest-leverage metric\n\nLTV (Lifetime Value):\n  — ARPU ÷ Monthly Churn\n  — Guides your acquisition budget\n\nCAC (Customer Acquisition Cost):\n  — Total sales & marketing spend ÷ new customers\n  — LTV:CAC ratio should be >3:1\n\nNet Revenue Retention (NRR):\n  — Expansion revenue offsets churned revenue\n  — >100% NRR means your existing customers are growing\n\nActivation:\n  — % of sign-ups who reach the \"aha moment\"\n  — The metric that predicts retention\n\nPick one metric to focus on each quarter.\\nMaster it. Then move to the next.\n\nWhat's the most important metric for your business right now?",
  },
  {
    id: "t100",
    industry: "Entrepreneurship",
    title: "Founder mental health",
    text: "Founder mental health is a crisis nobody talks about.\n\n72% of founders report mental health concerns.\n\nHere's how to protect yours:\n\n1/ Separate self-worth from company performance\n  — A bad quarter doesn't make you a bad person\n  — Your identity is bigger than your startup\n\n2/ Build a support system\n  — Therapist (non-negotiable)\n  — Founder friends who understand\n  — Co-founder who's a genuine partner\n\n3/ Set boundaries\n  — No email after 9pm\n  — One full day off per week\n  — Regular exercise (treat it as a meeting)\n\n4/ Celebrate wins, even small ones\n  — The default is to always look at what's next\n  — Pause and acknowledge progress\n\n5/ Remember why you started\n  — Reconnect with your mission regularly\n  — Purpose is protective\n\nThe best thing you can do for your startup is take care of yourself.\n\nHow are you protecting your mental health?",
  },

  // ── Marketing (more) ──
  {
    id: "t101",
    industry: "Marketing",
    title: "Influencer partnerships",
    text: "Influencer marketing works when it's authentic.\n\nHere's how to run partnerships that actually convert:\n\nFind the right fit:\n  — Micro-influencers (10-50k) > macro for conversion\n  — Niche relevance > follower count\n  — Engagement rate > reach\n\nStructure the partnership:\n  — Creative freedom (don't script them)\n  — Clear deliverables and timeline\n  — Affiliate or flat fee (performance-based)\n\nMeasure what matters:\n  — Use trackable links\n  — Promo codes for direct attribution\n  — Survey new customers for source\n\nBuild relationships, not transactions:\n  — Treat them as partners, not vendors\n  — Long-term relationships outperform one-offs\n  — Give early access, swag, exclusivity\n\nThe best influencer content doesn't feel like an ad.\n\nIt feels like a recommendation from a friend.\n\nWhat's your influencer strategy?",
  },
  {
    id: "t102",
    industry: "Marketing",
    title: "Landing page optimization",
    text: "Your landing page is your best salesperson.\n\nHere's how to optimize it:\n\nAbove the fold:\n  — Clear value proposition (what, who, why now)\n  — One primary CTA (not 5 competing options)\n  — Supporting visual (product screenshot or video)\n\nHeadline formula:\n  — \"[Target audience]: Get [desired outcome] with [unique mechanism]\"\n  — Example: \"Founders: Get your first 100 paying users with community-led growth\"\n\nSocial proof:\n  — Logos of companies that use you\n  — Specific testimonials with results\n  — Trust badges (security, awards)\n\nScarcity & urgency:\n  — Limited-time offers\n  — Countdown timers (for launches)\n  — Availability indicators\n\nForm optimization:\n  — Ask for the minimum info needed\n  — Multi-step forms convert better\n  — Clear privacy statement\n\nTest one thing at a time.\n\nLet the data decide.\n\nWhat's your current landing page conversion rate?",
  },
  {
    id: "t103",
    industry: "Marketing",
    title: "Retargeting strategies",
    text: "95% of visitors won't convert on their first visit.\n\nRetargeting captures the 95%.\n\nHere's how to retarget effectively:\n\nSegment by behavior:\n  — Page visitors: Brand awareness ads\n  — Product page visitors: Dynamic product ads\n  — Cart abandoners: Discount + urgency\n  — Past customers: Upsells and cross-sells\n\nFrequency capping:\n  — 3-5 impressions per day max\n  — More than that feels creepy\n\nCreative best practices:\n  — Match the look and feel of the original page\n  — Use testimonials for credibility\n  — Offer something (discount, free guide, demo)\n\nChannel mix:\n  — Meta (Facebook/Instagram) for B2C\n  — LinkedIn for B2B\n  — Google Display for broad reach\n  — Email retargeting for warm leads\n\nRetargeting works because familiarity builds trust.\n\nBut respect your audience's attention.\n\nWhat's your retargeting strategy?",
  },

  // ── Leadership (more) ──
  {
    id: "t104",
    industry: "Leadership",
    title: "Change management",
    text: "People don't resist change.\n\nThey resist being changed.\n\nHere's how to lead change effectively:\n\n1/ Explain the why before the what\n  — Context creates buy-in\n  — \"Here's why this change is necessary for us\"\n\n2/ Involve people in the process\n  — People support what they help create\n  — Solicit input, incorporate feedback\n\n3/ Communicate relentlessly\n  — You'll be tired of talking about it before they've heard it\n  — Multiple channels, multiple formats\n\n4/ Acknowledge the loss\n  — Change means losing something familiar\n  — Validate the emotion, don't dismiss it\n\n5/ Create quick wins\n  — Early successes build momentum\n  — Prove the change is working\n\n6/ Support through the transition\n  — Training, coaching, patience\n  — Not everyone moves at the same speed\n\nChange is a process, not an event.\n\nLead it well.\n\nWhat organizational change are you navigating?",
  },
];

export function getTemplatesByIndustry(industry?: string): Template[] {
  if (!industry || industry === "all") return TEMPLATES;
  return TEMPLATES.filter((t) => t.industry === industry);
}

export function getIndustries(): string[] {
  const set = new Set(TEMPLATES.map((t) => t.industry));
  return Array.from(set).sort();
}

export function searchTemplates(query: string): Template[] {
  const lower = query.toLowerCase();
  return TEMPLATES.filter(
    (t) =>
      t.title.toLowerCase().includes(lower) ||
      t.text.toLowerCase().includes(lower) ||
      t.industry.toLowerCase().includes(lower),
  );
}

export default TEMPLATES;
