import { createBoardChapterRoute } from "@/components/marketing/study-guide/chapter-route";

const route = createBoardChapterRoute("naplex");

export const dynamic = "force-static";
export const revalidate = 86400;
export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
