import TrackerApp from "@/components/TrackerApp";
export default function TrackPage({params}:{params:{code:string}}){return <TrackerApp initialCode={decodeURIComponent(params.code)}/>}
