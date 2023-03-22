import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { installLocalApp } from '../services/device';
import { Button } from '../ui-components/Button';
import { Panel, PanelContent, PanelHeader } from '../ui-components/panel';
import { Typography } from '../ui-components/Typography';
import styles from './InstallPanel.module.css';

type Props = {
  panelId: string;
};

export function InstallPanel({ panelId }: Props): JSX.Element {
  const [file, setFile] = useState<File>();
  const [working, setWorking] = useState(false);
  const ref = useRef<any>();
  const { t, i18n } = useTranslation();

  function reset() {
    if (ref.current) ref.current.value = '';
    setFile(undefined);
  }

  async function install() {
    if (!file || working) return;

    setWorking(true);
    await installLocalApp(file.path).catch((err) => console.log('err', err));
    setWorking(false);
    reset();
  }

  return (
    <Panel panelId={panelId}>
      <PanelHeader title={t("Installazip")} />
      <PanelContent>
        <Typography>
          {t("InstallTips")}
        </Typography>
        <input
          ref={ref}
          className={styles.input}
          type="file"
          accept="application/zip"
          onChange={(ev) => {
            if (ev.target.files?.[0]?.name.endsWith('.zip')) {
              setFile(ev.target.files[0]);
            } else {
              ev.target.value = '';
            }
          }}
        />
        <div className={styles.actions}>
          <Button type="secondary" text={t("Reset")} onClick={reset} />
          <Button text={t("Install")} disabled={!file || working} onClick={install} />
        </div>
      </PanelContent>
    </Panel>
  );
}
