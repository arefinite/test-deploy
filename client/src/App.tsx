import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import CreateBook from "./components/CreateBook"

const queryClient = new QueryClient({defaultOptions:{queries:{retry:false}}})

const App = () => {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
      <CreateBook/>
      </QueryClientProvider>
    </div>
  )
}
export default App