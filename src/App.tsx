import { MantineProvider } from "@mantine/core"
import "@mantine/core/styles.css"
import "@mantine/dropzone/styles.css"
import { ModalsProvider } from "@mantine/modals"
import { OptionsProvider, TranslationProvider } from "./contexts"
import OptionsPage from "./pages/OptionsPage"
import Popup from "./pages/Popup"
import "./style.scss"

//TODO:
// ☑️ 1. Opacity and isActive props for Labels
// ☑️ 2. Multi rules for one label
// ☑️ 3. Default labels (for the first launch)
// ☑️ 4. Label preview in edit form
// ☑️ 5. Import/export setting from/to file
// ☑️ 6. Import setting from url
// ☑️ 6.1 By user action (sync button)
// ☑️ 6.2 By timer (autoupdate)
// ☑️ 7. Draggable labels in the list
// ☑️ 8. UI improvements:
// ☑️ 8.1 user-friendly position selector in the edit form,
// ️☑️ 8.2 ribbon/triangle/frame icons for labels in the edit form
// ☑️ 8.3 confirmation dialog on delete label and delete all actions
// ☑️ 8.4 add on/off control for each label into the popup
// ☑️ 8.5 Split appearance and rules label settings into 2 different dialogs
// ☑️ 9. Support regexp or special symbols like *
// ☑️ 10. Dark mode
// 11. Tooltip features:
// 11.1 UI control for switching between label positions
// 11.2 Quick add active tab url to specific label rule
// ☑️ 12. Appearance customization:
// ☑️ 12.1 Label and font size customization
// ☑️ 12.2 Mouse over transparency
// ☑️ 12.3 Multiline name field
// 13. Rules:
// 13.1 Apply label by cookie key/value

function App() {
  return (
    <MantineProvider defaultColorScheme="auto">
      <OptionsProvider>
        <TranslationProvider>
          <ModalsProvider>
            {window.location.hash === "#popup" ? <Popup /> : <OptionsPage />}
          </ModalsProvider>
        </TranslationProvider>
      </OptionsProvider>
    </MantineProvider>
  )
}

export default App
