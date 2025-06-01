import { useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();
  return (
    <nav class="bg-sky-800">
      <ul class="container flex items-center p-3 text-gray-200">
        {[
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
          { href: "/resizer", label: "Resizer" }
        ].map(item => (
          <NavItem href={item.href}>{item.label}</NavItem>
        ))}
      </ul>
    </nav>
  );
}




interface NavItemProps {
  href: string;
  children: string;
}

function NavItem(props: NavItemProps) {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname ? "border-sky-600" : "border-transparent hover:border-sky-600";

  return (
    <li class={`border-b-2 ${active(props.href)} mx-1.5 sm:mx-6`}>
      <a href={props.href}>{props.children}</a>
    </li>
  );
}
