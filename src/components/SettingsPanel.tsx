import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../contexts/SettingsProvider';
import '../locale/index';
import { Language, TextSize, Theme } from '../models';
import { themes } from '../themes';
import { ColorInput } from '../ui-components/ColorInput';
import { Panel, PanelContent, PanelHeader } from '../ui-components/panel';
import { Select } from '../ui-components/Select';
import { Typography } from '../ui-components/Typography';
import styles from './SettingsPanel.module.css';
import { SettingsRow } from './SettingsRow';

type Props = {
  panelId: string;
};

export function SettingsPanel({ panelId }: Props): JSX.Element {
  const { settings, setSetting, setSettings } = useSettings();
  const { t, i18n } = useTranslation();
  return (
    <Panel panelId={panelId}>
      <PanelHeader title={t('Settings').toString()} />
      <PanelContent>
        
      <section className={styles.section}>
          <Typography type="title">{t('language')}</Typography>
          <SettingsRow title={t('language')}>
            <Select
              value={settings.language}
              options={[
                { value: Language.Chinese, label: '简体中文' },
                { value: Language.English, label: 'English' },
              ]}
              onChange={(val: Language) =>{
                setSetting('language', val); 
                i18n.changeLanguage(val);
              }
            }
            />
          </SettingsRow>
        </section>
        
        <section className={styles.section}>
          <Typography type="title">{t('Display')}</Typography>
          <SettingsRow title={t('TextSize')}>
            <Select
              value={settings.textSize}
              options={[
                { value: TextSize.Smallest, label: t('Smallest') },
                { value: TextSize.Small, label: t('Small') },
                { value: TextSize.Medium, label: t('Medium') },
                { value: TextSize.Large, label: t('Large') },
                { value: TextSize.Largest, label: t('Largest') },
              ]}
              onChange={(val: TextSize) => setSetting('textSize', val)}
            />
          </SettingsRow>
        </section>
        <section className={styles.section}>
          <Typography type="title">{t('Theme')}</Typography>
          <SettingsRow title={t('BaseTheme')}>
            <Select
              value={settings.theme}
              options={[
                { value: Theme.Light, label: t('Light') },
                { value: Theme.Warm, label: t('Warm' )},
                { value: Theme.Blue, label: t('Blue') },
                { value: Theme.Dark, label: t('Dark') },
                { value: Theme.Darker, label: t('Darker') },
                { value: Theme.Darkest, label:t('Darkest') },
              ]}
              onChange={(val: Theme) => {
                const theme = themes.find((a) => a.id === val) || themes[0];
                setSettings({
                  theme: val,
                  accentColor: theme.values.appAccentColor,
                });
              }}
            />
          </SettingsRow>
          <SettingsRow title={t('AccentColor')}>
            <ColorInput
              value={settings.accentColor}
              onChange={(val) => setSetting('accentColor', val)}
            />
          </SettingsRow>
          <SettingsRow
            title={t("AccentColorTitle")} 
            description={t("AccentColorDescription").toString()}
          >
            <Select
              value={settings.accentTextColor}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ]}
              onChange={(val: string) => setSetting('accentTextColor', val)}
            />
          </SettingsRow>
        </section>
      </PanelContent>
    </Panel>
  );
}
