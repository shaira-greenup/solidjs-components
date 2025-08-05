import Layout from ".";
import "./app.css";
export default function Home() {
  return (
    <main class="h-screen flex flex-col">
      <Layout>
        <Layout.Navbar></Layout.Navbar>
        <Layout.Overlay></Layout.Overlay>
        <Layout.Sidebar></Layout.Sidebar>
        <Layout.MainArea></Layout.MainArea>
        <Layout.BottomDash></Layout.BottomDash>
      </Layout>
    </main>
  );
}
