import TrackerApp from "@/components/TrackerApp";
export default async function TrackPage({params}:{params:Promise<{code:string}>}){const {code}=await params;return <TrackerApp initialCode={decodeURIComponent(code)}/>}
