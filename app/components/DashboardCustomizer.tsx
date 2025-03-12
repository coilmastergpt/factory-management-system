import { useState } from 'react';
import {
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  HStack,
  Text,
  Switch,
  useToast,
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';

interface DashboardSettings {
  layout: Array<{
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
  }>;
  widgets: {
    [key: string]: {
      visible: boolean;
    };
  };
}

interface Props {
  onSettingsChange: (settings: DashboardSettings) => void;
}

const DEFAULT_SETTINGS: DashboardSettings = {
  layout: [
    { i: 'stats', x: 0, y: 0, w: 12, h: 1 },
    { i: 'statusChart', x: 0, y: 1, w: 6, h: 2 },
    { i: 'priorityChart', x: 6, y: 1, w: 6, h: 2 },
    { i: 'trendChart', x: 0, y: 3, w: 6, h: 2 },
    { i: 'departmentStats', x: 6, y: 3, w: 6, h: 2 },
    { i: 'recentResolved', x: 0, y: 5, w: 12, h: 2 },
  ],
  widgets: {
    stats: { visible: true },
    statusChart: { visible: true },
    priorityChart: { visible: true },
    trendChart: { visible: true },
    departmentStats: { visible: true },
    recentResolved: { visible: true },
  },
};

const WIDGET_LABELS = {
  stats: '통계 요약',
  statusChart: '상태별 이슈',
  priorityChart: '우선순위별 이슈',
  trendChart: '일별 이슈 추이',
  departmentStats: '부서별 이슈 현황',
  recentResolved: '최근 해결된 이슈',
};

export default function DashboardCustomizer({ onSettingsChange }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [settings, setSettings] = useState<DashboardSettings>(DEFAULT_SETTINGS);
  const toast = useToast();

  const handleToggleWidget = (widgetId: string) => {
    const newSettings = {
      ...settings,
      widgets: {
        ...settings.widgets,
        [widgetId]: {
          visible: !settings.widgets[widgetId].visible,
        },
      },
    };
    setSettings(newSettings);
    onSettingsChange(newSettings);

    toast({
      title: `${WIDGET_LABELS[widgetId as keyof typeof WIDGET_LABELS]} ${newSettings.widgets[widgetId].visible ? '표시' : '숨김'}`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <>
      <IconButton
        aria-label="대시보드 설정"
        icon={<SettingsIcon />}
        onClick={onOpen}
        variant="ghost"
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>대시보드 설정</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack align="stretch" spacing={4}>
              {Object.entries(WIDGET_LABELS).map(([id, label]) => (
                <HStack key={id} justify="space-between">
                  <Text>{label}</Text>
                  <Switch
                    isChecked={settings.widgets[id].visible}
                    onChange={() => handleToggleWidget(id)}
                    colorScheme="blue"
                  />
                </HStack>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
} 