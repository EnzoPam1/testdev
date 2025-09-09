import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bottombar">
      <div className="bottomWrap">
        <div className="footerColumns">
          <div className="footerCol footerCol--brand">
            <div className="footerBrand">
              <Image
                src="/jeb_logo.png"
                alt="JEB Incubator"
                width={66}
                height={66}
                priority
              />
              <div className="footerBrandText">
                <span className="footerBrandName">JEB</span>
                <span className="footerBrandAccent">Incubator</span>
              </div>
            </div>
            <p className="footerText">
              JEB is an incubator dedicated to showcasing innovative projects.
              Our platform connects startups with investors, partners, and
              clients to accelerate growth.
            </p>
          </div>

          <div className="footerMenus">
            <div className="footerCol">
              <h4 className="footerTitle">About</h4>
              <Link href="#">Mission &amp; Vision</Link>
              <Link href="#">Team</Link>
              <Link href="#">Partners</Link>
              <Link href="#">Contact Us</Link>
            </div>

            <div className="footerCol">
              <h4 className="footerTitle">Resources</h4>
              <Link href="/">Home</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/news">News</Link>
              <Link href="/events">Events</Link>
              <Link href="/advanced-search">Advanced search</Link>
            </div>

            <div className="footerCol">
              <h4 className="footerTitle">Legal &amp; Practical Info</h4>
              <Link href="/legal">Legal notice</Link>
              <Link href="/legal">Privacy Policy</Link>
            </div>
          </div>
        </div>

        <div className="footerDivider" />
        <div className="footerCopy">2025 © JEB. All rights reserved.</div>
      </div>
    </footer>
  );
}
